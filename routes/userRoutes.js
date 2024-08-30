const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Endpoint to create a new user
router.post('/create-user', async (req, res) => {
    const { name, email } = req.body;

    // Validate incoming data
    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        // Check if a user with the given email already exists
        let user = await User.findOne({ email });

        // If the user doesn't exist, create a new one
        if (!user) {
            user = new User({
                name,
                email,
            });
            await user.save();
            return res.status(201).json({ message: 'User created successfully', user });
        }

        // If user exists, return the existing user data
        return res.status(200).json({ message: 'User already exists', user });
    } catch (error) {
        console.error('Error creating user:', error);

        // Handle unique constraint violation error
        if (error.code === 11000) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        // General server error
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
