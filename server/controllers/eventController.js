const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('attendees', 'name email');

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
    const { title, description, date, location, capacity, image } = req.body;

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

    // Make sure the logged in user matches the event creator
    if (event.creator.toString() !== req.user.id) {
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

        // Check if user already RSVP'd (since $addToSet wont return document if no change made? Wait, findOneAndUpdate returns processed document by default or pre-update doc. new:true returns post-update. If logic wasn't met, it returns null?
        // Actually findOneAndUpdate returns null if query criteria not met.

        // If user is already in attendees, we should check that.
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

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
    cancelRsvp,
};
