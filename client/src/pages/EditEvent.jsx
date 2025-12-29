import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ImagePicker from '../components/ImagePicker';

const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        capacity: '',
        category: 'Other',
        image: '',
    });

    const [collaborators, setCollaborators] = useState([]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await api.get(`/events/${id}`);
                const event = response.data;

                // Security Check: Only Creator or Collaborator can edit
                const creatorId = event.creator._id || event.creator; // Handle populated or unpopulated
                const isCreator = user && creatorId === user._id;
                const isCollaborator = user && event.collaborators && event.collaborators.some(c => (c._id || c) === user._id);

                if (!isCreator && !isCollaborator) {
                    toast.error('You are not authorized to edit this event');
                    navigate('/');
                    return;
                }

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
                    category: event.category || 'Other',
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
    }, [id, navigate, user]);

    const { title, description, date, location, capacity, category, image } = formData;

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

    const onImageSelected = (url) => {
        setFormData((prevState) => ({
            ...prevState,
            image: url,
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

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-600"></div></div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 mt-10 mb-20">
            <h1 className="text-3xl font-extrabold mb-8 text-center text-white drop-shadow-sm">Edit Event</h1>
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
                        />
                    </div>

                    {/* Description Section */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
                            Description <span className="text-xs font-normal text-slate-500 ml-2">(Markdown supported)</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            required
                            rows="6"
                            value={description}
                            onChange={onChange}
                            className="input-field resize-y min-h-[120px]"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="date" className="block text-sm font-semibold text-slate-300 mb-2">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="date"
                                id="date"
                                required
                                value={date}
                                onChange={onChange}
                                className="input-field dark-calendar"
                            />
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

                    {/* Collaborators Section - Styled */}
                    {collaborators.length > 0 && (
                        <div className="pt-4 border-t border-white/10">
                            <label className="block text-sm font-semibold text-slate-300 mb-4">Collaborators</label>
                            <div className="grid grid-cols-1 gap-3">
                                {collaborators.map(collab => (
                                    <div key={collab._id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold mr-3 text-sm">
                                                {collab.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-200">{collab.name}</p>
                                                <p className="text-xs text-slate-500">{collab.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeCollaborator(collab._id)}
                                            className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                                            title="Remove Collaborator"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-6 border-t border-white/10 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-1/3 btn btn-secondary flex justify-center py-3"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-2/3 btn btn-primary flex justify-center py-3 shadow-xl shadow-blue-600/20"
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
