import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUrl';

const FeaturedCarousel = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const featuredEvents = events.slice(0, 5); // Top 5 events

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
        }, 5000); // Auto-slide every 5 seconds
        return () => clearInterval(timer);
    }, [featuredEvents.length]);

    if (featuredEvents.length === 0) return null;

    return (
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-12 border border-white/10 group">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <img
                        src={getImageUrl(featuredEvents[currentIndex].image)}
                        alt={featuredEvents[currentIndex].title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
                <motion.div
                    key={`text-${currentIndex}`}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 drop-shadow-md">
                        Featured Event
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                        {featuredEvents[currentIndex].title}
                    </h2>
                    <div className="flex flex-wrap items-center text-slate-200 mb-8 space-x-6 text-lg">
                        <div className="flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-400" />
                            {new Date(featuredEvents[currentIndex].date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-blue-400" />
                            {featuredEvents[currentIndex].location}
                        </div>
                    </div>
                    <Link
                        to={`/event/${featuredEvents[currentIndex]._id}`}
                        className="inline-block bg-white text-slate-950 font-bold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-lg transform hover:-translate-y-1"
                    >
                        View Details
                    </Link>
                </motion.div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 right-8 flex space-x-2 z-20">
                {featuredEvents.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-blue-500 w-8' : 'bg-white/30 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedCarousel;
