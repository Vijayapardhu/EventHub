const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
    cancelRsvp,
    addCollaborator,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, createEvent);
router.route('/:id').get(getEventById).put(protect, updateEvent).delete(protect, deleteEvent);
router.route('/:id/rsvp').put(protect, rsvpEvent);
router.route('/:id/cancel').put(protect, cancelRsvp);
router.route('/:id/collaborate').put(protect, addCollaborator);

module.exports = router;
