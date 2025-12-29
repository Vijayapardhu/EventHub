import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { FaSearch, FaFilter, FaPlus, FaCalendarTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, upcoming, past
    const { user } = useAuth();

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
            setFilteredEvents(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        let result = events;

        // Search
        if (searchTerm) {
            result = result.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter Date
        if (filter === 'upcoming') {
            result = result.filter(event => new Date(event.date) >= new Date());
        } else if (filter === 'past') {
            result = result.filter(event => new Date(event.date) < new Date());
        }

        setFilteredEvents(result);
    }, [searchTerm, filter, events]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 pb-24 md:pb-8"> {/* Added bottom padding for mobile FAB */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Discover Events</h1>
                    <p className="text-gray-500 mt-2 text-lg">Find and join amazing events near you.</p>
                </div>

                <Link to="/create-event" className="hidden md:flex btn btn-primary items-center shadow-lg shadow-gray-900/20">
                    <FaPlus className="mr-2" /> Create Event
                </Link>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-10 sticky top-24 z-30">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search events, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-4 text-lg border-gray-200 bg-gray-50 rounded-2xl focus:ring-gray-900 focus:border-gray-900 w-full transition-shadow hover:shadow-sm"
                        />
                        <FaSearch className="absolute left-4 top-5 text-gray-400 text-lg" />
                    </div>
                    <div className="relative md:w-48">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-12 pr-10 py-4 text-lg border-gray-200 bg-gray-50 rounded-2xl focus:ring-gray-900 focus:border-gray-900 w-full appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            <option value="all">All Dates</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                        <FaFilter className="absolute left-4 top-5 text-gray-400" />
                        <div className="absolute right-4 top-6 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500"></div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
                </div>
            ) : (
                <>
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <FaCalendarTimes className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                                We couldn't find any events matching your criteria. Try adjusting your filters.
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                                className="mt-6 btn btn-secondary"
                            >
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event) => (
                                <EventCard key={event._id} event={event} onUpdate={fetchEvents} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Mobile Floating Action Button */}
            {user && (
                <Link to="/create-event" className="md:hidden fixed bottom-6 right-6 h-16 w-16 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transform hover:scale-110 active:scale-95 transition-all">
                    <FaPlus size={24} />
                </Link>
            )}
        </div>
    );
};

export default Dashboard;
