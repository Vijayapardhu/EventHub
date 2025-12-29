export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // If it's already a full URL (http/https or data:)
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
        // Upgrade to HTTPS if the app is served over HTTPS to avoid mixed content
        if (window.location.protocol === 'https:' && imagePath.startsWith('http:')) {
            return imagePath.replace('http:', 'https:');
        }
        return imagePath;
    }

    // Get API URL from env
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // Extract base URL (remove /api)
    // Assuming structure is http://domain.com/api -> http://domain.com
    let baseUrl = apiUrl.replace(/\/api\/?$/, '');

    // Ensure path starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    // Remove double slashes if any (e.g. base ending in / and path starting with /)
    // actually base replacement above handles suffix /api, but let's be safe about trailing slash on base
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return `${baseUrl}${cleanPath}`;
};
