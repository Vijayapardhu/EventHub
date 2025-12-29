import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaRegCalendarAlt, FaTrash, FaEdit, FaUserPlus, FaShareAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const EventCard = ({ event, onDelete, onRsvp }) => {
    const { user } = useAuth();
    const isOwner = user && event.creator && user._id === event.creator._id;
    const isCollaborator = user && event.collaborators && event.collaborators.includes(user._id);
    const isAttending = user && event.attendees.includes(user._id);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await axios.delete(`/events/${event._id}`);
                toast.success('Event deleted successfully');
                if (onDelete) onDelete(event._id);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete event');
            }
        }
    };

    const handleCollaborate = async () => {
        const email = window.prompt('Enter email of user to invite as collaborator:');
        if (!email) return;

        try {
            await axios.put(`/events/${event._id}/collaborate`, { email });
            toast.success('Collaborator added successfully');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add collaborator');
        }
    };

    const handleShare = (e) => {
        e.preventDefault(); // Prevent Link navigation if wrapped
        navigator.clipboard.writeText(`${window.location.origin}/event/${event._id}`);
        toast.info('Event link copied to clipboard!');
    };

    const handleRsvp = async () => {
        if (!user) {
            toast.error('Please login to RSVP');
            return;
        }
        try {
            if (isAttending) {
                await axios.put(`/events/${event._id}/rsvp`, { action: 'leave' });
                toast.info('You have left the event');
            } else {
                await axios.put(`/events/${event._id}/rsvp`, { action: 'join' });
                toast.success('RSVP successful!');
            }
            if (onRsvp) onRsvp();
        } catch (error) {
            toast.error(error.response?.data?.message || 'RSVP failed');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col h-full"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {event.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                        {event.category}
                    </div>
                )}

                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                        onClick={handleShare}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-sm"
                        title="Share Event"
                    >
                        <FaShareAlt size={14} />
                    </button>

                    {isOwner && (
                        <>
                            <button
                                onClick={handleCollaborate}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors shadow-sm"
                                title="Invite Collaborator"
                            >
                                <FaUserPlus size={14} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                                title="Delete Event"
                            >
                                <FaTrash size={14} />
                            </button>
                        </>
                    )}

                    {(isOwner || isCollaborator) && (
                        <Link
                            to={`/edit-event/${event._id}`}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-green-500 hover:bg-green-50 hover:text-green-600 transition-colors shadow-sm"
                            title="Edit Event"
                        >
                            <FaEdit size={14} />
                        </Link>
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs font-semibold text-indigo-600 mb-3 tracking-wide uppercase">
                    <FaRegCalendarAlt className="mr-1.5" />
                    {formatDate(event.date)}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {event.title}
                </h3>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                    {event.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span className="truncate">{event.location}</span>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                            {/* Placeholder avatars based on count */}
                            {[...Array(Math.min(3, event.attendees.length))].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-bold">
                                    <FaUser size={10} />
                                </div>
                            ))}
                            {event.attendees.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-500 font-bold">
                                    +{event.attendees.length - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                            {event.attendees.length === 0 ? 'Be the first!' : `${event.attendees.length} joined`}
                        </span>
                    </div>

                    {user ? (
                        <button
                            onClick={handleRsvp}
                            disabled={!isAttending && event.attendees.length >= event.capacity}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isAttending
                                ? 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                                : event.attendees.length >= event.capacity
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg transform hover:-translate-y-0.5'
                                }`}
                        >
                            {isAttending ? 'Going' : event.attendees.length >= event.capacity ? 'Full' : 'Join'}
                        </button>
                    ) : (
                        <Link to="/login" className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                            Join &rarr;
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;
