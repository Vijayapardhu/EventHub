import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUrl';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const closeMenu = () => setIsOpen(false);

    return (
        <nav className="glass sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group" onClick={closeMenu}>
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/20">
                                <FaCalendarAlt className="h-5 w-5" />
                            </div>
                            <span className="ml-3 font-bold text-2xl tracking-tight text-white group-hover:text-blue-400 transition-all">EventHub</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                            Discover
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create-event" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                    Create Event
                                </Link>
                                <Link to="/profile" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                    Profile
                                </Link>
                                <Link to="/my-events" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                                <div className="pl-8 flex items-center space-x-6 border-l border-white/10 h-8 my-auto">
                                    <div className="flex items-center space-x-3">
                                        {user.profileImage ? (
                                            <img
                                                src={getImageUrl(user.profileImage)}
                                                alt={user.name}
                                                className="h-9 w-9 rounded-full object-cover border border-white/20 shadow-sm"
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-slate-200 tracking-wide bg-white/5 px-3 py-1 rounded-full border border-white/10 shadow-sm">
                                                {user.name.split(' ')[0]}
                                            </span>
                                        )}
                                    </div>
                                    <button onClick={handleLogout} className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors">
                                        Log out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4 pl-8 border-l border-white/10">
                                <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn btn-primary text-sm !px-6 !py-2.5">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 glass border-t border-white/5 p-4 shadow-2xl animate-fade-in-down bg-slate-950/95">
                    <div className="space-y-3">
                        <Link to="/" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                            Discover Events
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create-event" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    Create Event
                                </Link>
                                <Link to="/profile" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    My Profile
                                </Link>
                                <Link to="/my-events" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                                    My Dashboard
                                </Link>
                                <div className="mt-4 pt-4 border-t border-white/10 px-2">
                                    <div className="flex items-center mb-4">
                                        {user.profileImage ? (
                                            <img
                                                src={getImageUrl(user.profileImage)}
                                                alt={user.name}
                                                className="h-10 w-10 rounded-full object-cover border border-blue-500/30"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-lg font-bold text-blue-400">
                                                {user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-white">{user.name}</div>
                                            <div className="text-xs text-slate-400">{user.email}</div>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="w-full btn btn-secondary justify-center py-3 text-red-400 border-red-500/20 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/40">
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                                <Link to="/login" onClick={closeMenu} className="btn btn-secondary justify-center text-center">
                                    Log in
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="btn btn-primary justify-center text-center">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
