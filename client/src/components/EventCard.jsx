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
            className="group glass-card rounded-3xl overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                    alt={event.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                    {event.category && (
                        <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            {event.category}
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                        onClick={handleShare}
                        className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-white hover:text-indigo-600 transition-all shadow-lg"
                        title="Share Event"
                    >
                        <FaShareAlt size={14} />
                    </button>

                    {isOwner && (
                        <>
                            <button
                                onClick={handleCollaborate}
                                className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-blue-500 hover:border-blue-500 transition-all shadow-lg"
                                title="Invite Collaborator"
                            >
                                <FaUserPlus size={14} />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-lg"
                                title="Delete Event"
                            >
                                <FaTrash size={14} />
                            </button>
                        </>
                    )}

                    {(isOwner || isCollaborator) && (
                        <Link
                            to={`/edit-event/${event._id}`}
                            className="p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-green-500 hover:border-green-500 transition-all shadow-lg"
                            title="Edit Event"
                        >
                            <FaEdit size={14} />
                        </Link>
                    )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 animate-fade-in-up">
                    <div className="flex items-center text-white/90 text-sm font-medium mb-1 drop-shadow-md">
                        <FaRegCalendarAlt className="mr-2 text-indigo-300" />
                        {formatDate(event.date)}
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10">
                <Link to={`/event/${event._id}`} className="block group-hover:text-indigo-600 transition-colors">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">{event.title}</h3>
                </Link>

                <div className="flex items-start text-gray-500 text-sm mb-4 line-clamp-1">
                    <FaMapMarkerAlt className="mr-2 mt-0.5 text-indigo-400 flex-shrink-0" />
                    <span>{event.location}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {event.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <FaUser className="mr-1.5 text-indigo-400" />
                        {event.attendees.length} / {event.capacity}
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
