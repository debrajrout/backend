const mongoose = require('mongoose');
const { Schema } = mongoose;

// User Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    appliedJobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    acceptedJobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    rejectedJobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    ownedJobs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
