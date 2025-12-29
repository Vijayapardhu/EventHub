import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaCalendarAlt } from 'react-icons/fa';

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
                            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
                                <FaCalendarAlt className="h-5 w-5" />
                            </div>
                            <span className="ml-3 font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:to-violet-600 transition-all">EventHub</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                            Discover
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create-event" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                    Create Event
                                </Link>
                                <Link to="/profile" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                    Profile
                                </Link>
                                <Link to="/my-events" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                                    Dashboard
                                </Link>
                                <div className="pl-8 flex items-center space-x-6 border-l border-gray-200/50 h-8 my-auto">
                                    <span className="text-sm font-bold text-gray-800 tracking-wide bg-white/50 px-3 py-1 rounded-full border border-white/50 shadow-sm">{user.name.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors">
                                        Log out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4 pl-8 border-l border-gray-200/50">
                                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors">
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
                            className="p-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 right-0 glass border-t border-white/20 p-4 shadow-xl animate-fade-in-down">
                    <div className="space-y-3">
                        <Link to="/" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                            Discover Events
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create-event" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                    Create Event
                                </Link>
                                <Link to="/my-events" onClick={closeMenu} className="block px-4 py-3 rounded-xl text-base font-semibold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                                    My Dashboard
                                </Link>
                                <div className="mt-4 pt-4 border-t border-gray-100/50 px-2">
                                    <div className="flex items-center mb-4">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-700">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="w-full btn btn-secondary justify-center py-3 text-red-500 border-red-100 hover:bg-red-50">
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100/50">
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
