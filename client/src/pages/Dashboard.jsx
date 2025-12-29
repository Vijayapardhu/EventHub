import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryExplorer from '../components/CategoryExplorer';
import { FaSearch, FaFilter, FaPlus, FaCalendarTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, upcoming, past
    const [category, setCategory] = useState('All');
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

        // Filter Date / Type
        if (filter === 'upcoming') {
            result = result.filter(event => new Date(event.date) >= new Date());
        } else if (filter === 'past') {
            result = result.filter(event => new Date(event.date) < new Date());
        } else if (filter === 'liked' && user) {
            result = result.filter(event => event.likes && event.likes.includes(user._id));
        }

        // Filter Category
        if (category !== 'All') {
            result = result.filter(event => event.category === category);
        }

        setFilteredEvents(result);
    }, [searchTerm, filter, category, events]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10 mb-20">
            {/* Hero Section */}
            {/* Hero Section */}
            {/* Hero Section / Carousel */}
            {events.length > 0 ? (
                <FeaturedCarousel events={events.filter(e => new Date(e.date) >= new Date()).slice(0, 5)} />
            ) : (
                <div className="relative rounded-3xl overflow-hidden mb-12 shadow-2xl animate-fade-in-down border border-white/10 group">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Event Background"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400 drop-shadow-sm">Amazing Events</span> <br /> Happening Near You
                            </h1>
                            <p className="text-slate-300 text-lg md:text-xl font-medium mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                                Join the community, find your passion, and create unforgettable memories with EventHub.
                            </p>
                            <Link to="/create-event" className="inline-flex items-center btn btn-primary font-bold text-lg px-8 py-4 shadow-blue-500/25">
                                <FaPlus className="mr-2" /> CREATE EVENT
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Explorer */}
            <CategoryExplorer selectedCategory={category} onSelectCategory={setCategory} />

            {/* Search and Filters */}
            {/* Search and Filters */}
            <div className="bg-slate-900 rounded-2xl p-4 md:p-6 mb-12 sticky top-24 z-30 border border-white/5 shadow-xl glass-card">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search events, locations..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-14 py-4 text-lg rounded-xl"
                        />
                    </div>
                    <div className="relative md:w-56">
                        <FaFilter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input-field pl-14 pr-10 py-4 text-lg appearance-none cursor-pointer rounded-xl"
                        >
                            <option value="all" className="bg-slate-900 text-slate-200">All Dates</option>
                            <option value="upcoming" className="bg-slate-900 text-slate-200">Upcoming</option>
                            <option value="past" className="bg-slate-900 text-slate-200">Past</option>
                            {user && <option value="liked" className="bg-slate-900 text-slate-200">Liked Events</option>}
                        </select>
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </div>
                    </div>

                    <div className="relative md:w-56">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="input-field pl-6 pr-10 py-4 text-lg appearance-none cursor-pointer rounded-xl"
                        >
                            <option value="All" className="bg-slate-900 text-slate-200">All Categories</option>
                            <option value="Music" className="bg-slate-900 text-slate-200">Music</option>
                            <option value="Technology" className="bg-slate-900 text-slate-200">Technology</option>
                            <option value="Sports" className="bg-slate-900 text-slate-200">Sports</option>
                            <option value="Art" className="bg-slate-900 text-slate-200">Art</option>
                            <option value="Food" className="bg-slate-900 text-slate-200">Food</option>
                            <option value="Business" className="bg-slate-900 text-slate-200">Business</option>
                            <option value="Other" className="bg-slate-900 text-slate-200">Other</option>
                        </select>
                        <div className="absolute right-5 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64 animate-pulse">
                    <div className="h-12 w-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-400 font-medium">Finding events...</p>
                </div>
            ) : (
                <>
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-slate-900 rounded-3xl border border-white/5 shadow-lg glass-card">
                            <div className="mx-auto h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5">
                                <FaCalendarTimes className="h-10 w-10 text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
                            <p className="text-slate-400 mt-2 max-w-md mx-auto text-lg">
                                We couldn't find any events matching your criteria.
                                <br className="hidden md:block" /> Try searching for something else!
                            </p>
                            <button
                                onClick={() => { setSearchTerm(''); setFilter('all'); setCategory('All'); }}
                                className="mt-8 btn btn-primary px-8"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredEvents.map((event) => (
                                <EventCard key={event._id} event={event} onDelete={fetchEvents} onRsvp={fetchEvents} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Mobile Floating Action Button */}
            {user && (
                <Link to="/create-event" className="md:hidden fixed bottom-6 right-6 h-16 w-16 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center z-40 transform hover:scale-110 active:scale-95 transition-all border border-blue-400/20">
                    <FaPlus size={24} />
                </Link>
            )}
        </div>
    );
};

export default Dashboard;
