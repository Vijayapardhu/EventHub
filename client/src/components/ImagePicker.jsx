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

    const handleClear = (e) => {
        e.stopPropagation();
        setPreview('');
        onImageSelected('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
                {label || 'Event Cover Image'}
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
                        className={`
                            border border-dashed border-white/20 rounded-xl p-10 
                            text-center cursor-pointer 
                            hover:border-blue-500 hover:bg-white/5 
                            transition-all duration-300 ease-in-out
                            ${uploading ? 'opacity-60 pointer-events-none' : ''}
                        `}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center py-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-blue-500 mb-3"></div>
                                <span className="text-blue-400 font-medium text-sm">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-slate-400 group-hover:text-blue-400 transition-colors">
                                <div className="mb-3 p-3 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors">
                                    <FaCloudUploadAlt className="text-2xl" />
                                </div>
                                <span className="font-medium text-sm text-slate-300 group-hover:text-blue-400">Click to upload image</span>
                                <span className="text-xs mt-1 text-slate-500">JPG, PNG, WebP up to 5MB</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-64 bg-slate-800 group">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all duration-300 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full hover:bg-white hover:text-blue-600 transition-all shadow-sm transform hover:scale-110"
                                title="Change Image"
                            >
                                <FaImage size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-2.5 bg-white/90 backdrop-blur-sm text-slate-700 rounded-full hover:bg-white hover:text-red-500 transition-all shadow-sm transform hover:scale-110"
                                title="Remove Image"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-2 flex items-center"><span className="mr-1">•</span>{error}</p>}
        </div>
    );
};

export default ImagePicker;
