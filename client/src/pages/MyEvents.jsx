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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
                <button
                    className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'attending' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('attending')}
                >
                    Attending ({attendingEvents.length})
                </button>
                <button
                    className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'created' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('created')}
                >
                    Created ({createdEvents.length})
                </button>
                <button
                    className={`py-4 px-6 font-medium text-sm focus:outline-none whitespace-nowrap ${activeTab === 'collaborating' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('collaborating')}
                >
                    Collaborating ({collaboratingEvents.length})
                </button>
            </div>

            {displayedEvents.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">You have no events in this category.</p>
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
