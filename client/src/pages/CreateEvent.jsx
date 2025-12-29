import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import ImagePicker from '../components/ImagePicker';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        category: 'Other',
        image: '',
    });

    const { title, description, date, location, capacity, category, image } = formData;
    const navigate = useNavigate();

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onImageSelected = (url) => {
        setFormData((prevState) => ({
            ...prevState,
            image: url,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post('/events', formData);
            toast.success('Event Created Successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create event');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-10 mb-20">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-sm">Create New Event</h1>
            <div className="glass-card bg-slate-900 p-8 md:p-10 border border-white/5 shadow-2xl">
                <form onSubmit={onSubmit} className="space-y-8">
                    {/* Title Section */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-300 mb-2">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={title}
                            onChange={onChange}
                            className="input-field text-lg font-medium"
                            placeholder="e.g. Summer Music Festival"
                        />
                    </div>

                    {/* Description Section */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2 flex justify-between">
                            <span>Description</span>
                            <span className="text-xs font-normal text-slate-500">Markdown supported</span>
                        </label>
                        <div className="relative">
                            <textarea
                                name="description"
                                id="description"
                                required
                                rows="6"
                                value={description}
                                onChange={onChange}
                                className="input-field resize-y min-h-[120px]"
                                placeholder="Describe your event details, schedule, and what to expect..."
                            ></textarea>
                            <div className="absolute bottom-3 right-3 text-slate-500 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="3" y2="18"></line></svg>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="date" className="block text-sm font-semibold text-slate-300 mb-2">Date & Time</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    name="date"
                                    id="date"
                                    required
                                    value={date}
                                    onChange={onChange}
                                    className="input-field cursor-pointer dark-calendar"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-semibold text-slate-300 mb-2">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                id="capacity"
                                required
                                min="1"
                                value={capacity}
                                onChange={onChange}
                                className="input-field"
                                placeholder="Total seats available"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="location" className="block text-sm font-semibold text-slate-300 mb-2">Location</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="location"
                                    id="location"
                                    required
                                    value={location}
                                    onChange={onChange}
                                    className="input-field pl-10"
                                    placeholder="Start typing a location..."
                                />
                                <div className="absolute left-3.5 top-3.5 text-slate-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    id="category"
                                    value={category}
                                    onChange={onChange}
                                    className="input-field appearance-none"
                                >
                                    <option value="Music" className="bg-slate-900 text-slate-200">Music</option>
                                    <option value="Technology" className="bg-slate-900 text-slate-200">Technology</option>
                                    <option value="Sports" className="bg-slate-900 text-slate-200">Sports</option>
                                    <option value="Art" className="bg-slate-900 text-slate-200">Art</option>
                                    <option value="Food" className="bg-slate-900 text-slate-200">Food</option>
                                    <option value="Business" className="bg-slate-900 text-slate-200">Business</option>
                                    <option value="Other" className="bg-slate-900 text-slate-200">Other</option>
                                </select>
                                <div className="absolute right-3.5 top-4 text-slate-500 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <ImagePicker
                            label="Event Cover Image"
                            onImageSelected={onImageSelected}
                            currentImage={image}
                        />
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            className="w-full btn btn-primary flex justify-center items-center py-4 text-base font-semibold shadow-xl shadow-blue-600/20 hover:shadow-blue-600/30 transition-all font-bold tracking-wide"
                        >
                            <span className="mr-2">Create Event</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
