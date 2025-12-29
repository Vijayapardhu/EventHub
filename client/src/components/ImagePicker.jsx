import { useState, useRef } from 'react';
import { FaCloudUploadAlt, FaTimes, FaImage } from 'react-icons/fa';
import api from '../api/axios';


const ImagePicker = ({ label, onImageSelected, currentImage }) => {
    const [preview, setPreview] = useState(currentImage || '');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Reset
        setError('');
        setUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };

            const response = await api.post('/upload', formData, config);
            // Construct full URL if returned path is relative
            // Note: In production, backend URL + filePath
            // For now, assume the backend returns a usable URL or we prepend the base URL

            // Adjust this logic depending on what your backend returns and your setup
            // If backend returns { fullUrl: "..." }, use that.
            const imageUrl = response.data.fullUrl || response.data.filePath;

            setPreview(imageUrl);
            onImageSelected(imageUrl);
            setUploading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to upload image. Please try again.');
            setUploading(false);
        }
    };

    const handleClear = () => {
        setPreview('');
        onImageSelected('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label || 'Event Image'}
            </label>

            <div className="relative group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />

                {!preview ? (
                    <div
                        onClick={() => fileInputRef.current.click()}
                        className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600 mb-2"></div>
                                <span className="text-indigo-600 font-medium">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-gray-500 group-hover:text-indigo-600">
                                <FaCloudUploadAlt className="text-4xl mb-2" />
                                <span className="font-medium text-sm">Click to upload image</span>
                                <span className="text-xs mt-1 text-gray-400">JPG, PNG, WebP up to 5MB</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-all h-64 bg-gray-100">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-colors"
                                title="Change Image"
                            >
                                <FaImage size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-full hover:bg-red-600 transition-colors"
                                title="Remove Image"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>
    );
};

export default ImagePicker;
