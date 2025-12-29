const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: [true, 'Please add a comment'],
            trim: true,
            maxlength: [500, 'Comment cannot be more than 500 characters']
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Comment', commentSchema);
