import { useState, useEffect } from 'react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('attending'); // attending, created

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const attendingEvents = events.filter(event => event.attendees.includes(user?._id));
    const createdEvents = events.filter(event => event.creator === user?._id);
    const collaboratingEvents = events.filter(event => event.collaborators && event.collaborators.includes(user?._id));

    const displayedEvents = activeTab === 'attending'
        ? attendingEvents
        : activeTab === 'created'
            ? createdEvents
            : collaboratingEvents;

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
            <h1 className="text-3xl font-bold text-white mb-8">My Dashboard</h1>

            <div className="flex border-b border-white/10 mb-8 overflow-x-auto">
                <button
                    className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap transition-colors ${activeTab === 'attending' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setActiveTab('attending')}
                >
                    Attending ({attendingEvents.length})
                </button>
                <button
                    className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap transition-colors ${activeTab === 'created' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setActiveTab('created')}
                >
                    Created ({createdEvents.length})
                </button>
                <button
                    className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap transition-colors ${activeTab === 'collaborating' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setActiveTab('collaborating')}
                >
                    Collaborating ({collaboratingEvents.length})
                </button>
            </div>

            {displayedEvents.length === 0 ? (
                <div className="text-center py-12 bg-slate-900 rounded-3xl border border-white/5 shadow-lg glass-card">
                    <p className="text-slate-400">You have no events in this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedEvents.map((event) => (
                        <EventCard key={event._id} event={event} onUpdate={fetchEvents} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyEvents;
