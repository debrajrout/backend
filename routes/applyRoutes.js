const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

const router = express.Router();

// Configure AWS S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/:jobId/apply', upload.single('resumeFile'), async (req, res) => {
    const { email, coverLetter, education, skills, whyJoin } = req.body;
    const { jobId } = req.params;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const existingApplication = await Application.findOne({ jobId, applicantId: user._id });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        // Handle the resume upload
        let resumeUrl = '';
        if (req.file) {
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `resumes/${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read', // Make the file publicly accessible
            };

            const command = new PutObjectCommand(uploadParams);
            await s3Client.send(command);

            // The permanent public URL of the file
            resumeUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        } else {
            return res.status(400).json({ message: 'Resume file is required.' });
        }

        // Ensure `education` is an object
        const educationData = typeof education === 'string' ? JSON.parse(education) : education;

        const application = new Application({
            jobId,
            applicantId: user._id,
            applicantName: user.name,
            education: educationData,
            skills: skills.split(',').map(skill => skill.trim()),
            whyJoin,
            resumeUrl,
            coverLetter
        });

        await application.save();

        user.appliedJobs.push(application._id);
        await user.save();

        job.appliedUsers.push(application._id);
        await job.save();

        res.json({ message: 'Job application successful', applicationId: application._id, resumeUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
