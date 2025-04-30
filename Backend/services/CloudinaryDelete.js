import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    if (!publicIds || publicIds.length === 0) return null;
    
    const deletePromises = publicIds.map(publicId => 
      publicId ? cloudinary.v2.uploader.destroy(publicId) : Promise.resolve(null)
    );
    
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('Error deleting multiple files from Cloudinary:', error);
    throw error;
  }
};