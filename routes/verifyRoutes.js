const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// Admin route to manage jobs and applications
router.post('/admin', async (req, res) => {
    try {
        const { email } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user is an admin
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: You do not have admin privileges' });
        }

        // Fetch all job posts
        const jobs = await Job.find({}).populate('postedBy', 'name email');

        // Fetch all applications
        const applications = await Application.find({}).populate('applicantId', 'name email').populate('jobId', 'name companyName');

        res.status(200).json({ jobs, applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Verify a job post
router.patch('/verify-job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        job.verified = true;
        await job.save();

        res.status(200).json({ message: 'Job post verified successfully', job });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a job post
router.delete('/delete-job/:jobId', async (req, res) => {
    try {
        const { jobId } = req.params;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await job.deleteOne();

        res.status(200).json({ message: 'Job post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete an application by its ID
router.delete('/delete-application/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await application.deleteOne();
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
