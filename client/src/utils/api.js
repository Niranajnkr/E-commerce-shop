const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  // Otherwise, prepend the backend URL
  return `${backendUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

export default {
  getImageUrl,
};
