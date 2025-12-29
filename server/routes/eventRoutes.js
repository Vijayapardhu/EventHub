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
    toggleLikeEvent,
    getEventsByUserId,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getEvents).post(protect, createEvent);
router.route('/:id').get(getEventById).put(protect, updateEvent).delete(protect, deleteEvent);
router.put('/:id/rsvp', protect, rsvpEvent);
router.put('/:id/cancel', protect, cancelRsvp);
router.put('/:id/like', protect, toggleLikeEvent);
router.get('/user/:userId', getEventsByUserId);
router.route('/:id/collaborate').put(protect, addCollaborator);

module.exports = router;
