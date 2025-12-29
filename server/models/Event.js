const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Please add a title'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        date: {
            type: Date,
            required: [true, 'Please add a date and time'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        category: {
            type: String,
            enum: ['Music', 'Technology', 'Sports', 'Art', 'Food', 'Business', 'Other'],
            default: 'Other'
        },
        capacity: {
            type: Number,
            required: [true, 'Please set a capacity'],
            min: [1, 'Capacity must be at least 1'],
        },
        image: {
            type: String, // URL from Cloudinary
            required: [true, 'Please upload an image'],
        },
        attendees: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        collaborators: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    {
        timestamps: true,
    }
);

// We will handle concurrency/capacity check in the Controller using atomic operators
module.exports = mongoose.model('Event', eventSchema);
