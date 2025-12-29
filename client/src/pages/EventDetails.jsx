import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { FaMapMarkerAlt, FaUser, FaRegCalendarAlt, FaShareAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import CommentsSection from '../components/CommentsSection';
import ReactMarkdown from 'react-markdown';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Check if user is attending, similar logic to EventCard
    const isAttending = user && event && event.attendees.includes(user._id);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Public route ideally, but currently our backend routes might be protected?
                // Checked backend: getEventById is Public. Good.
                const response = await api.get(`/events/${id}`);
                setEvent(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                toast.error('Failed to load event details');
            }
        };
        fetchEvent();
    }, [id]);

    const handleRsvp = async () => {
        if (!user) {
            toast.error('Please login to RSVP');
            return;
        }
        try {
            if (isAttending) {
                await api.put(`/events/${id}/rsvp`, { action: 'leave' });
                toast.info('You have left the event');
                // Refresh data
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            } else {
                await api.put(`/events/${id}/rsvp`, { action: 'join' });
                toast.success('RSVP successful!');
                const res = await api.get(`/events/${id}`);
                setEvent(res.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'RSVP failed');
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
    };

    const navigate = useNavigate();
    const isOwner = user && event && (event.creator._id === user._id || event.creator === user._id);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            try {
                await api.delete(`/events/${id}`);
                toast.success('Event deleted successfully');
                navigate('/');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete event');
            }
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!event) return <div className="text-center mt-20">Event not found</div>;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
            <div className="glass-card bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                <div className="relative h-64 sm:h-96">
                    <img
                        src={getImageUrl(event.image) || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                    <div className="absolute top-4 right-4 flex space-x-3">
                        {isOwner && (
                            <>
                                <Link
                                    to={`/edit-event/${event._id}`}
                                    className="p-3 bg-slate-900/90 rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors shadow-lg border border-white/10"
                                    title="Edit Event"
                                >
                                    <FaEdit size={20} />
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="p-3 bg-slate-900/90 rounded-full text-white hover:bg-red-500 hover:border-red-500 transition-colors shadow-lg border border-white/10"
                                    title="Delete Event"
                                >
                                    <FaTrash size={20} />
                                </button>
                            </>
                        )}
                        <button
                            onClick={handleShare}
                            className="p-3 bg-slate-900/90 rounded-full text-white hover:bg-white hover:text-blue-600 transition-colors shadow-lg border border-white/10"
                            title="Share Event"
                        >
                            <FaShareAlt size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <div className="flex items-center text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">
                                <FaRegCalendarAlt className="mr-2" />
                                {formatDate(event.date)}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{event.title}</h1>
                            <div className="flex items-center text-slate-400 font-medium">
                                <FaMapMarkerAlt className="mr-2" />
                                {event.location}
                            </div>
                        </div>

                        <div className="mt-6 md:mt-0 w-full md:w-auto">
                            {user ? (
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                    <button
                                        onClick={handleRsvp}
                                        disabled={!isAttending && event.attendees.length >= event.capacity}
                                        className={`w-full md:w-auto px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 ${isAttending
                                            ? 'bg-green-600/10 text-green-400 border border-green-600/20 hover:bg-green-600/20'
                                            : event.attendees.length >= event.capacity
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                                : 'btn-primary'
                                            }`}
                                    >
                                        {isAttending ? 'Attending' : event.attendees.length >= event.capacity ? 'Full' : 'Join Event'}
                                    </button>
                                    <a
                                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description || '')}&location=${encodeURIComponent(event.location)}&dates=${new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "")}/${new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "")}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full md:w-auto px-6 py-3 rounded-full text-lg font-bold bg-slate-800 text-white hover:bg-slate-700 border border-white/10 shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center"
                                    >
                                        <FaRegCalendarAlt className="mr-2" /> Add to Calendar
                                    </a>
                                </div>
                            ) : (
                                <Link to="/login" className="block w-full md:w-auto text-center px-8 py-3 rounded-full text-lg font-bold bg-white text-slate-900 hover:bg-slate-200 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                    Login to Join
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">About this Event</h3>
                                <div className="text-slate-300 leading-relaxed text-lg markdown-body prose prose-invert max-w-none">
                                    <ReactMarkdown>
                                        {event.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        <div> {/* This is the right container (md:col-span-1 implicitly) */}
                            <h3 className="text-xl font-bold text-white mb-3">Location</h3>
                            <div className="bg-slate-900 rounded-2xl overflow-hidden border border-white/5 h-64 md:h-80 shadow-inner relative group">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                    className="filter grayscale-[50%] invert-[90%] contrast-125 group-hover:filter-none transition-all duration-500"
                                    title="Event Location"
                                ></iframe>
                                <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>
                            </div>
                            <div className="mt-2 text-slate-400 flex items-center text-sm">
                                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                {event.location}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-2xl p-6 border border-white/5 shadow-md">
                            <h3 className="font-bold text-white mb-4 flex items-center">
                                <FaUser className="mr-2 text-blue-500" />
                                Attendees ({event.attendees.length} / {event.capacity})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {event.attendees.slice(0, 10).map((attendee) => (
                                    <div key={attendee._id} className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400" title={attendee.name}>
                                        {attendee.name.charAt(0)}
                                    </div>
                                ))}
                                {event.attendees.length > 10 && (
                                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                                        +{event.attendees.length - 10}
                                    </div>
                                )}
                                {event.attendees.length === 0 && <span className="text-sm text-slate-500">Be the first to join!</span>}
                            </div>
                        </div>

                        <div className="bg-blue-900/10 rounded-2xl p-6 border border-blue-500/10">
                            <h3 className="font-bold text-blue-200 mb-2">Hosted By</h3>
                            <Link to={`/profile/${event.creator._id}`} className="text-blue-400 font-medium hover:text-blue-300 hover:underline transition-colors">
                                {event.creator?.name || 'Unknown'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <CommentsSection eventId={event._id} />
            </div>

            {/* Similar Events Section */}
            <SimilarEvents currentEvent={event} />
        </div>
    );
};

const SimilarEvents = ({ currentEvent }) => {
    const [similarEvents, setSimilarEvents] = useState([]);

    useEffect(() => {
        const fetchSimilar = async () => {
            try {
                const res = await api.get(`/events?category=${currentEvent.category}&exclude=${currentEvent._id}`);
                setSimilarEvents(res.data.slice(0, 3));
            } catch (err) {
                console.error("Failed to fetch similar events", err);
            }
        };

        if (currentEvent) {
            fetchSimilar();
        }
    }, [currentEvent]);

    if (similarEvents.length === 0) return null;

    return (
        <div className="mt-16 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold text-white mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {similarEvents.map(event => (
                    <EventCard key={event._id} event={event} />
                ))}
            </div>
        </div>
    );
};

export default EventDetails;
