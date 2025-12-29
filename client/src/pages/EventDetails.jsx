import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { FaMapMarkerAlt, FaUser, FaRegCalendarAlt, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

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

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!event) return <div className="text-center mt-20">Event not found</div>;

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-16">
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="relative h-64 sm:h-96">
                    <img
                        src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                        <button
                            onClick={handleShare}
                            className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg"
                            title="Share Event"
                        >
                            <FaShareAlt size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <div className="flex items-center text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wider">
                                <FaRegCalendarAlt className="mr-2" />
                                {formatDate(event.date)}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">{event.title}</h1>
                            <div className="flex items-center text-gray-500 font-medium">
                                <FaMapMarkerAlt className="mr-2" />
                                {event.location}
                            </div>
                        </div>

                        <div className="mt-6 md:mt-0 w-full md:w-auto">
                            {user ? (
                                <button
                                    onClick={handleRsvp}
                                    disabled={!isAttending && event.attendees.length >= event.capacity}
                                    className={`w-full md:w-auto px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all transform hover:-translate-y-1 ${isAttending
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : event.attendees.length >= event.capacity
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                                        }`}
                                >
                                    {isAttending ? 'Attending' : event.attendees.length >= event.capacity ? 'Full' : 'Join Event'}
                                </button>
                            ) : (
                                <Link to="/login" className="block w-full md:w-auto text-center px-8 py-3 rounded-full text-lg font-bold bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                    Login to Join
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">About this Event</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                                    <FaUser className="mr-2 text-indigo-500" />
                                    Attendees ({event.attendees.length} / {event.capacity})
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {/* We might not want to show full list if it's huge, but for now it's fine */}
                                    {event.attendees.slice(0, 10).map((attendee) => (
                                        <div key={attendee._id} className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700" title={attendee.name}>
                                            {attendee.name.charAt(0)}
                                        </div>
                                    ))}
                                    {event.attendees.length > 10 && (
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                            +{event.attendees.length - 10}
                                        </div>
                                    )}
                                    {event.attendees.length === 0 && <span className="text-sm text-gray-500">Be the first to join!</span>}
                                </div>
                            </div>

                            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                                <h3 className="font-bold text-indigo-900 mb-2">Hosted By</h3>
                                <p className="text-indigo-700 font-medium">{event.creator?.name || 'Unknown'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
