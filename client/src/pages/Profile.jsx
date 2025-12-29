import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import ImagePicker from '../components/ImagePicker';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setProfileImage(user.profileImage || '');
        }
    }, [user]);

    const onImageSelected = (url) => {
        setProfileImage(url);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password && password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            await updateUserProfile({ name, email, password, profileImage });
            toast.success('Profile updated successfully');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="max-w-md mx-auto glass-card bg-slate-900 p-8 md:p-10 border border-white/5 shadow-2xl rounded-3xl">
                <h2 className="text-2xl font-bold mb-8 text-center text-white">User Profile</h2>

                <div className="flex justify-center mb-8">
                    <ImagePicker
                        label=""
                        onImageSelected={onImageSelected}
                        currentImage={profileImage}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2 pl-1">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2 pl-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2 pl-1">New Password (optional)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="Leave blank to keep current"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-300 text-sm font-medium mb-2 pl-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="input-field"
                            placeholder="Leave blank to keep current"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full btn btn-primary py-3.5 font-bold shadow-lg mt-4"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
