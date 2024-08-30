const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // Import your Job model

// Route to fetch all jobs
router.get('/jobs', async (req, res) => {
    try {
        // Fetch all jobs from the database
        const jobs = await Job.find().populate('postedBy', 'name email'); // Populate with user details if needed
        res.json({ data: jobs }); // Send jobs data in response
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;
