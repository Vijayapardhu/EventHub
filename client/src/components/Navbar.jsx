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
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group" onClick={closeMenu}>
                            <div className="bg-gray-900 text-white p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                <FaCalendarAlt className="h-5 w-5" />
                            </div>
                            <span className="ml-3 font-bold text-xl tracking-tight text-gray-900 group-hover:text-black transition-colors">EventHub</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            Discover
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create-event" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                    Create Event
                                </Link>
                                <Link to="/my-events" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                                    Dashboard
                                </Link>
                                <div className="pl-8 flex items-center space-x-6 border-l border-gray-200 h-8 my-auto">
                                    <span className="text-sm font-semibold text-gray-900 tracking-wide">{user.name.split(' ')[0]}</span>
                                    <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
                                        Log out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-6 pl-8 border-l border-gray-200">
                                <Link to="/login" className="text-sm font-bold text-gray-900 hover:text-black transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register" className="btn btn-primary text-sm !px-6 !py-2.5 shadow-lg shadow-gray-200">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 focus:outline-none transition-colors"
                        >
                            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden fixed inset-0 top-20 bg-white/95 backdrop-blur-xl z-40 overflow-y-auto pb-20 animate-fade-in-down flex flex-col justify-start pt-8">
                    <div className="px-6 space-y-4">
                        <Link to="/" onClick={closeMenu} className="block px-6 py-5 rounded-3xl text-lg font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm border border-gray-100">
                            Discover Events
                        </Link>
                        {user ? (
                            <>
                                <Link to="/create-event" onClick={closeMenu} className="block px-6 py-5 rounded-3xl text-lg font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm border border-gray-100">
                                    Create Event
                                </Link>
                                <Link to="/my-events" onClick={closeMenu} className="block px-6 py-5 rounded-3xl text-lg font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm border border-gray-100">
                                    My Dashboard
                                </Link>
                                <div className="mt-8 pt-6 px-2 border-t border-gray-100">
                                    <div className="flex items-center mb-8 px-2">
                                        <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-600 shadow-inner">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-lg font-bold text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500 font-medium">{user.email}</div>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="w-full btn btn-secondary justify-center py-4 text-lg text-red-600 border-red-100 hover:bg-red-50 rounded-2xl shadow-sm">
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 mt-8 pt-4 border-t border-gray-100 px-2">
                                <Link to="/login" onClick={closeMenu} className="btn btn-secondary justify-center text-center py-4 text-lg rounded-2xl shadow-sm">
                                    Log in
                                </Link>
                                <Link to="/register" onClick={closeMenu} className="btn btn-primary justify-center text-center py-4 text-lg rounded-2xl shadow-lg shadow-gray-200">
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
