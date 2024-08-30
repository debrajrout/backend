const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// Get all jobs posted by the user and their applications using email to find the user
router.get('/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find all jobs posted by this user
        const jobs = await Job.find({ postedBy: user._id });

        // For each job, find all applications
        const jobsWithApplications = await Promise.all(jobs.map(async (job) => {
            const applications = await Application.find({ jobId: job._id })
                .populate('applicantId', 'name email');
            return {
                job,
                applications,
            };
        }));

        res.status(200).json({ jobs: jobsWithApplications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Update application status
router.patch('/applications/:applicationId/status', async (req, res) => {
    const { status } = req.body;
    const { applicationId } = req.params;

    try {
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        res.status(200).json({ message: 'Application status updated', application });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete a job post by its ID
router.delete('/jobs/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ message: 'Job post not found' });
        }

        // Delete all applications associated with this job
        await Application.deleteMany({ jobId: jobId });

        // Delete the job post itself
        await job.deleteOne();

        res.status(200).json({ message: 'Job post and associated applications deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
