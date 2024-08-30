const mongoose = require('mongoose');
const { Schema } = mongoose;

// Job Schema
const jobSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
    },
    salaryRange: {
        type: String,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    appliedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    verified: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ['Technology', 'Healthcare', 'Finance', 'Education', 'Other'],
    }

}, {
    timestamps: true
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;