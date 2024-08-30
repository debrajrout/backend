const mongoose = require('mongoose');
const { Schema } = mongoose;

// Application Schema.
const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    applicantId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applicantName: {
        type: String,
        required: true,
    },
    education: {
        degree: {
            type: String,
            required: true,
        },
        institution: {
            type: String,
            required: true,
        },
        graduationYear: {
            type: Number,
            required: true,
        }
    },
    skills: [
        {
            type: String,
            required: true,
        }
    ],
    whyJoin: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Shortlisted', 'Rejected'],
        default: 'Applied',
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    coverLetter: {
        type: String,
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
    feedback: {
        type: String,
    },
}, {
    timestamps: true,
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
