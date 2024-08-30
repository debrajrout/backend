const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Import the DB connection function
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use('/api/users', require('./routes/userRoutes')); // User-related routes
app.use('/api/jobs', require('./routes/jobRoutes'));  // Job-related routes
app.use('/api/getjobs', require('./routes/fetchAllJobs'));  // Job-related routes
app.use('/api/fetch-user', require('./routes/fetchUserId')); // Fetch user by email
app.use('/api/apply', require('./routes/applyRoutes')); // Apply for a job
app.use('/api/applications', require('./routes/applicationStatus')); // Application status routes of all applyers
app.use('/api/admin', require('./routes/verifyRoutes'));//Verify posts
app.use('/api/posted-jobs', require('./routes/jobApplicationDetails')); // Get all jobs posted by the user and their applications
// app.use('/api/verify', require('./routes/ClerkWebhook')); // Clerk webhook to create users

// Server Setup
const PORT = process.env.PORT || 5000; // Get the port from environment variables or use 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server