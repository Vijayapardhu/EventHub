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
        image: '',
    });

    const { title, description, date, location, capacity, image } = formData;
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
        <div className="max-w-2xl mx-auto px-4 py-8 mt-16 pb-20">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-8 text-center">Create New Event</h1>
            <div className="glass p-8 rounded-3xl shadow-xl">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={title}
                            onChange={onChange}
                            className="input-field"
                            placeholder="e.g. Summer Music Festival"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            rows="4"
                            value={description}
                            onChange={onChange}
                            className="input-field"
                            placeholder="Event details..."
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-bold text-gray-700 mb-2">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                required
                                value={date}
                                onChange={onChange}
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                id="capacity"
                                required
                                min="1"
                                value={capacity}
                                onChange={onChange}
                                className="input-field"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            value={location}
                            onChange={onChange}
                            className="input-field"
                            placeholder="e.g. Central Park, NY"
                        />
                    </div>

                    <div>
                        <ImagePicker
                            label="Event Cover Image"
                            onImageSelected={onImageSelected}
                            currentImage={image}
                        />
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            className="w-full btn btn-primary flex justify-center py-4 text-lg shadow-xl"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;
