import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        image: '',
    });

    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                const event = response.data;
                // Format date for input field (YYYY-MM-DDThh:mm)
                const dateObj = new Date(event.date);
                const offset = dateObj.getTimezoneOffset() * 60000;
                const localISOTime = (new Date(dateObj - offset)).toISOString().slice(0, 16);

                setFormData({
                    title: event.title,
                    description: event.description,
                    date: localISOTime,
                    location: event.location,
                    capacity: event.capacity,
                    image: event.image,
                });
                if (event.collaborators) {
                    setCollaborators(event.collaborators);
                }
                setLoading(false);
            } catch (error) {
                toast.error('Failed to fetch event details');
                navigate('/');
            }
        };
        fetchEvent();
    }, [id, navigate]);

    const { title, description, date, location, capacity, image } = formData;

    const removeCollaborator = async (collabId) => {
        if (!window.confirm('Remove this collaborator?')) return;

        // Filter out the removed ID
        const updatedCollaborators = collaborators.filter(c => c._id !== collabId);
        // We need to send just the IDs to the backend
        const collaboratorIds = updatedCollaborators.map(c => c._id);

        try {
            await api.put(`/events/${id}`, { collaborators: collaboratorIds });
            setCollaborators(updatedCollaborators);
            toast.success('Collaborator removed');
        } catch (error) {
            toast.error('Failed to remove collaborator');
        }
    };


    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/events/${id}`, formData);
            toast.success('Event Updated Successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update event');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 mt-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Edit Event</h1>
            <div className="bg-white p-8 rounded-xl shadow-md">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            value={title}
                            onChange={onChange}
                            className="mt-1 input-field"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            rows="4"
                            value={description}
                            onChange={onChange}
                            className="mt-1 input-field"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                required
                                value={date}
                                onChange={onChange}
                                className="mt-1 input-field"
                            />
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                id="capacity"
                                required
                                min="1"
                                value={capacity}
                                onChange={onChange}
                                className="mt-1 input-field"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                        <input
                            type="text"
                            name="location"
                            id="location"
                            required
                            value={location}
                            onChange={onChange}
                            className="mt-1 input-field"
                        />
                    </div>

                    <div>
                        type="url"
                        name="image"
                        id="image"
                        required
                        value={image}
                        onChange={onChange}
                        className="mt-1 input-field"
                        />
                    </div>

                    {/* Collaborators Section - Only for Creator */}
                    {collaborators.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Collaborators</label>
                            <div className="bg-gray-50 rounded-md p-4 space-y-3">
                                {collaborators.map(collab => (
                                    <div key={collab._id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                                                {collab.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{collab.name}</p>
                                                <p className="text-xs text-gray-500">{collab.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCollaborator(collab._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-1/3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-2/3 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none"
                        >
                            Update Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
