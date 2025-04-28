import axios from "axios";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("http://localhost:3001/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    return {
      url: response.data.url,
      public_id: response.data.public_id
    };
  } catch (error) {
    console.error("Error uploading file:", error.response?.data || error.message);
    throw error;
  }
}; 