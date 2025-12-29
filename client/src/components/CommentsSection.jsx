import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUrl';

const CommentsSection = ({ eventId }) => {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/${eventId}`);
            setComments(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        try {
            const res = await api.post(`/comments/${eventId}`, { text });
            setComments([res.data, ...comments]);
            setText('');
            toast.success('Comment added');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            toast.success('Comment deleted');
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className="text-center py-4 text-slate-500">Loading comments...</div>;

    return (
        <div className="bg-slate-900 rounded-2xl p-6 md:p-8 border border-white/5 shadow-md mt-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                Discussion <span className="ml-2 text-sm font-normal text-slate-300 bg-white/10 px-2 py-0.5 rounded-full">{comments.length}</span>
            </h3>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
                    <div className="flex-shrink-0">
                        {user.profileImage ? (
                            <img
                                src={getImageUrl(user.profileImage)}
                                alt={user.name}
                                className="h-10 w-10 rounded-full object-cover border border-blue-500/30 shadow-lg"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-grow relative">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-slate-900 focus:border-blue-500/50 transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-blue-400 hover:bg-blue-500/10 rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 rounded-xl p-4 text-center mb-8 border border-white/10">
                    <p className="text-slate-400">Please <a href="/login" className="text-blue-400 font-semibold hover:underline">login</a> to participate in the discussion.</p>
                </div>
            )}

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-center text-slate-500 italic">No comments yet. Be the first to say something!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="flex gap-4 group">
                            <div className="flex-shrink-0">
                                <Link to={`/profile/${comment.user._id}`}>
                                    {comment.user.profileImage ? (
                                        <img
                                            src={getImageUrl(comment.user.profileImage)}
                                            alt={comment.user.name}
                                            className="h-10 w-10 rounded-full object-cover border border-slate-700 hover:border-blue-500 transition-colors"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700 hover:border-blue-500 transition-colors">
                                            {comment.user.name.charAt(0)}
                                        </div>
                                    )}
                                </Link>
                            </div>
                            <div className="flex-grow">
                                <div className="flex items-baseline justify-between">
                                    <Link to={`/profile/${comment.user._id}`} className="text-sm font-bold text-white hover:text-blue-400 transition-colors">
                                        {comment.user.name}
                                    </Link>
                                    <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
                                </div>
                                <p className="text-slate-300 mt-1 text-sm leading-relaxed">{comment.text}</p>
                            </div>
                            {user && user._id === comment.user._id && (
                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all self-start"
                                    title="Delete comment"
                                >
                                    <FaTrash size={12} />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;
