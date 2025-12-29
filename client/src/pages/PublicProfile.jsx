import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import { getImageUrl } from '../utils/imageUrl';
import { FaUser, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const PublicProfile = () => {
    const { userId } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, eventsRes] = await Promise.all([
                    api.get(`/users/${userId}`),
                    api.get(`/events/user/${userId}`)
                ]);
                setProfileUser(userRes.data);
                setEvents(eventsRes.data);
            } catch (error) {
                console.error('Failed to fetch profile data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    if (loading) return <div className="text-center mt-20 text-white">Loading profile...</div>;
    if (!profileUser) return <div className="text-center mt-20 text-white">User not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
            {/* Profile Header */}
            <div className="relative mb-16">
                <div className="h-64 rounded-3xl overflow-hidden shadow-2xl relative">
                    <img
                        src="https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                        alt="Cover"
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                </div>

                <div className="absolute -bottom-12 left-8 md:left-16 flex items-end">
                    <div className="relative">
                        <img
                            src={getImageUrl(profileUser.profileImage)}
                            alt={profileUser.name}
                            className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-slate-950 shadow-2xl object-cover bg-slate-800"
                        />
                    </div>
                    <div className="mb-4 ml-6">
                        <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-md">{profileUser.name}</h1>
                        <p className="text-slate-300 flex items-center mt-2 text-lg">
                            <FaEnvelope className="mr-2 text-blue-400" /> {profileUser.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                            <FaCalendarAlt size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{events.length}</div>
                            <div className="text-slate-400">Events Hosted</div>
                        </div>
                    </div>
                </div>
                {/* Additional stats could go here */}
            </div>

            {/* Hosted Events */}
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Events Hosted by {profileUser.name.split(' ')[0]}</h2>

            {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map(event => (
                        <EventCard key={event._id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-white/5 text-slate-400">
                    <p>No events hosted yet.</p>
                </div>
            )}
        </div>
    );
};

export default PublicProfile;
