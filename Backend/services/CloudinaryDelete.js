import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dz7fnzqrs',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret',
});

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};