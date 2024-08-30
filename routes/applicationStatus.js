const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');

// Get all applications of the user by email
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch applications for the user
        const applications = await Application.find({ applicantId: user._id }).populate('jobId', 'name companyName');

        res.status(200).json({ data: applications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Delete an application by its ID
router.delete('/delete/:applicationId', async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Use findByIdAndDelete or deleteOne
        await Application.findByIdAndDelete(applicationId);


        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
