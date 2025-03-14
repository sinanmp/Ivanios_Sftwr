import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

// Admin Login
async function login(data) {
  try {
    const response = await API.post("/adminLogin", data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

// Add Student to Batch
async function addStudentToBatch(data) {
  try {
    const response = await API.post("/addStudentToBatch", data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

// Create Batch
async function createBatch(data) {
  try {
    const response = await API.post("/createBatch", data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

// Get Students in Batch
async function getStudentsInBatch(batchId) {
  try {
    const response = await API.get(`/getStudentsInBatch?batchId=${batchId}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

// Get All Batches
async function getAllBatches() {
  try {
    const response = await API.get("/getAllBatches");
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

export default {
  login,
  addStudentToBatch,
  createBatch,
  getStudentsInBatch,
  getAllBatches,
};