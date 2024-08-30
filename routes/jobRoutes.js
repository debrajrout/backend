const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const Job = require('../models/Job');
const User = require('../models/User');

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

// Create a new job with image upload
router.post('/create-job', upload.single('image'), async (req, res) => {
    const { name, type, category, location, description, salaryRange, isAvailable, postedBy, companyName } = req.body;

    try {
        // Check if the user exists
        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let imageUrl = '';
        if (req.file) {
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `jobs/${Date.now()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                ACL: 'public-read',
            };

            console.log("Uploading to S3 with params: ", uploadParams);

            try {
                const command = new PutObjectCommand(uploadParams);
                await s3Client.send(command);

                // Create the public URL for the uploaded image
                imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
                console.log("File uploaded successfully to URL: ", imageUrl);
            } catch (s3Error) {
                console.error("Error uploading to S3: ", s3Error);
                return res.status(500).json({ error: "Failed to upload image to S3" });
            }
        }

        // Create a new job
        const job = new Job({
            name,
            type,
            category,
            location,
            description,
            imageUrl,
            salaryRange,
            isAvailable,
            postedBy,
            companyName,
        });

        // Save the job
        const savedJob = await job.save();

        // Update the user's ownedJobs array
        user.ownedJobs.push(savedJob._id);
        await user.save();

        // Respond with the created job
        res.status(201).json({ data: savedJob });
    } catch (err) {
        console.error("Error creating job: ", err.message);
        res.status(500).json({ error: "Failed to create job" });
    }
});

module.exports = router;
