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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10 mb-20">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl animate-fade-in-down">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Event Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 to-indigo-900/80 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                            Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Amazing Events</span> <br /> Happening Near You
                        </h1>
                        <p className="text-indigo-100 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                            Join the community, find your passion, and create unforgettable memories with EventHub.
                        </p>
                        <Link to="/create-event" className="inline-flex items-center btn bg-white text-indigo-700 hover:bg-indigo-50 hover:scale-105 shadow-xl font-bold text-lg px-8 py-4">
                            <FaPlus className="mr-2" /> CREATE EVENT
                        </Link>
                    </div>
                    <div className="hidden md:block w-72 h-72 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full blur-3xl opacity-30 absolute -right-20 -bottom-20 animate-pulse"></div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="glass rounded-2xl p-4 md:p-6 mb-12 sticky top-24 z-30 shadow-xl border border-white/40">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search events, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-14 pr-4 py-4 text-lg bg-gray-50/50 border-transparent focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 w-full transition-all hover:bg-white/80 placeholder-gray-400 font-medium text-gray-700"
                        />
                    </div>
                    <div className="relative md:w-56">
                        <FaFilter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-indigo-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-14 pr-10 py-4 text-lg bg-gray-50/50 border-transparent focus:bg-white rounded-xl focus:ring-2 focus:ring-indigo-500 w-full appearance-none cursor-pointer hover:bg-white/80 font-medium text-gray-700 transition-all"
                        >
                            <option value="all">All Dates</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-indigo-400"></div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 animate-pulse">
                    <div className="h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium">Finding events...</p>
                </div>
            ) : (
                <>
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-lg">
                            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <FaCalendarTimes className="h-10 w-10 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No events found</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto text-lg">
                                We couldn't find any events matching your criteria.
                                <br className="hidden md:block" /> Try searching for something else!
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                                className="mt-8 btn btn-primary px-8"
                            >
                                Clear All Filters
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
                <Link to="/create-event" className="md:hidden fixed bottom-6 right-6 h-16 w-16 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-full shadow-2xl shadow-indigo-500/40 flex items-center justify-center z-40 transform hover:scale-110 active:scale-95 transition-all">
                    <FaPlus size={24} />
                </Link>
            )}
        </div>
    );
};

export default Dashboard;
