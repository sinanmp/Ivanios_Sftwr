import axios from "axios";

export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ivanios_files"); // Replace with your Cloudinary upload preset
  formData.append("resource_type", "auto"); // Automatically detect file type (image, video, raw)

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dz7fnzqrs/upload`, // Correct endpoint
      formData
    );

    return {
      url: response.data.secure_url, // File URL
      public_id: response.data.public_id, // Public ID for future deletion
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

