/**
 * Get the full URL for an image path from the backend.
 * If the path starts with 'http' or 'https', return it as is.
 * Otherwise, prepend the backend base URL.
 * @param {string} path The image path (e.g., /uploads/avatars/...)
 * @returns {string} The full image URL
 */
export const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:")) {
        return path;
    }
    
    const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
    // Ensure there's no double slash if path already starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${baseURL}${cleanPath}`;
};
