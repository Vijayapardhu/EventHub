const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const { category, exclude } = req.query;
    let query = {};

    if (category) {
        query.category = category;
    }

    if (exclude) {
        query._id = { $ne: exclude };
    }

    const events = await Event.find(query).sort({ date: 1 }).populate('creator', 'name email');
    res.status(200).json(events);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id)
        .populate('creator', 'name email')
        .populate('attendees', 'name email')
        .populate('collaborators', 'name email');

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.status(200).json(event);
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location, capacity, image, category } = req.body;

    if (!title || !description || !date || !location || !capacity || !image) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const event = await Event.create({
        creator: req.user.id,
        title,
        description,
        date,
        location,
        capacity,
        image,
        category: category || 'Other',
    });

    res.status(201).json(event);
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the event creator OR is a collaborator
    const isCreator = event.creator.toString() === req.user.id;
    const isCollaborator = event.collaborators.includes(req.user.id);

    if (!isCreator && !isCollaborator) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedEvent);
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the event creator
    if (event.creator.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await event.deleteOne(); // or remove() depending on mongoose version

    res.status(200).json({ id: req.params.id });
});

// @desc    RSVP to event
// @route   PUT /api/events/:id/rsvp
// @access  Private
const rsvpEvent = asyncHandler(async (req, res) => {
    // ATOMIC UPDATE FOR CONCURRENCY HANDLING
    // We check if the size of attendees array is LESS than capacity in the query itself.
    // $addToSet prevents duplicates.

    const event = await Event.findOneAndUpdate(
        {
            _id: req.params.id,
            $expr: { $lt: [{ $size: '$attendees' }, '$capacity'] },
        },
        {
            $addToSet: { attendees: req.user.id },
        },
        {
            new: true,
        }
    );

    if (!event) {
        // Check if event exists but is full, or just doesn't exist
        const checkEvent = await Event.findById(req.params.id);
        if (!checkEvent) {
            res.status(404);
            throw new Error('Event not found');
        }

        // Check if user already RSVP'd
        const isAlreadyAttending = checkEvent.attendees.includes(req.user.id);
        if (isAlreadyAttending) {
            res.status(400);
            throw new Error('You have already RSVPd to this event');
        }

        res.status(400);
        throw new Error('Event is fully booked');
    }

    res.status(200).json(event);
});

// @desc    Cancel RSVP
// @route   PUT /api/events/:id/cancel
// @access  Private
const cancelRsvp = asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndUpdate(
        req.params.id,
        {
            $pull: { attendees: req.user.id },
        },
        { new: true }
    );

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    res.status(200).json(event);
});

// @desc    Add Collaborator
// @route   PUT /api/events/:id/collaborate
// @access  Private
const addCollaborator = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Only creator can add collaborators
    if (event.creator.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Only the creator can add collaborators');
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
        res.status(404);
        throw new Error('User not found');
    }

    if (event.collaborators.includes(userToAdd.id)) {
        res.status(400);
        throw new Error('User is already a collaborator');
    }

    event.collaborators.push(userToAdd.id);
    await event.save();

    res.status(200).json(event);
});

// @desc    Toggle like on an event
// @route   PUT /api/events/:id/like
// @access  Private
const toggleLikeEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error('Event not found');
    }

    // Check if event has already been liked
    if (event.likes.includes(req.user.id)) {
        // Unlike
        event.likes = event.likes.filter(id => id.toString() !== req.user.id);
    } else {
        // Like
        event.likes.push(req.user.id);
    }

    await event.save();

    // Return the updated likes array
    res.json(event.likes);
});

// @desc    Get events by user ID
// @route   GET /api/events/user/:userId
// @access  Public
const getEventsByUserId = asyncHandler(async (req, res) => {
    const events = await Event.find({ creator: req.params.userId }).sort({ date: 1 }).populate('creator', 'name email');
    res.status(200).json(events);
});

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
    cancelRsvp,
    addCollaborator,
    toggleLikeEvent,
    getEventsByUserId,
};
