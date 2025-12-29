const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const { protect } = require('../middleware/authMiddleware');

// @route   GET api/comments/:eventId
// @desc    Get comments for an event
// @access  Public
router.get('/:eventId', async (req, res) => {
    try {
        const comments = await Comment.find({ event: req.params.eventId })
            .populate('user', 'name email profileImage')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST api/comments/:eventId
// @desc    Add a comment to an event
// @access  Private
router.post('/:eventId', protect, async (req, res) => {
    try {
        const { text } = req.body;
        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (!text) {
            return res.status(400).json({ message: 'Please add text' });
        }

        const comment = await Comment.create({
            event: req.params.eventId,
            user: req.user._id,
            text,
        });

        // Populate user details to return immediately
        const populatedComment = await Comment.findById(comment._id).populate('user', 'name profileImage');

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check user ownership
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await comment.remove();

        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
