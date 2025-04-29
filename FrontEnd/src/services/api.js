import axios from "axios";

// Create an Axios instance
// const API = axios.create({
//   baseURL: "http://localhost:3001/api",
//   withCredentials: true,
// });
// const API = axios.create({
//   baseURL: "https://ivanios-portal-api.vercel.app/api",
//   withCredentials: true,
// });

const API = axios.create({
  baseURL: "https://api.ivaniosedutech.com/api",
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
    const response = await API.post("/addStudentToBatch", { data });
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

async function fetchStudents(page , search) {
  try {
    const response = await API.get(`/fetchStudents?page=${page}&&search=${search}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}


async function getStudentDetails(id) {
  try {
    const response = await API.get(`/getStudentDetails?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

async function getBatchDetails(id){
  try{
    const response = await API.get(`/getBatchDetails?id=${id}`);
    console.log("api js", response)
    return response.data;
  }
  catch(error){
    console.log(error)
    return error.response ? error.response.data:{error : "Network Error"}
  }
}


async function fetchCourses(id){
  try{
    const response = await API.get(`/getCourses`);
    console.log("api js", response)
    return response.data;
  }
  catch(error){
    console.log(error)
    return error.response ? error.response.data:{error : "Network Error"}
  }
}

async function deleteBatch(id) {
  try {
    const response = await API.delete(`/deleteBatch?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

async function deleteStudent(id) {
  try {
    const response = await API.delete(`/deleteStudent?id=${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

async function updateStudent(id, data) {
  try {
    const response = await API.put(`/updateStudent?id=${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
}

const updateBatch = async (id, data) => {
  try {
    const response = await API.put(`/batches/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: true, message: "Failed to update batch" };
  }
};

export const getCourseDetails = async (id) => {
  try {
    const response = await API.get(`/getCourseDetails?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching course details:", error);
    return error.response?.data || { error: true, message: "Failed to fetch course details" };
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await API.delete(`/deleteCourse/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (id, data) => {
  try {
    const response = await API.put(`/updateCourse/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const response = await API.get("/getCourses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addCourse = async (data) => {
  try {
    const response = await API.post("/addCourse", data);
    return response.data;
  } catch (error) {
    console.error("Error adding course:", error);
    return error.response?.data || { error: true, message: "Failed to add course" };
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await API.post("/addStudent", studentData);
    return response.data;
  } catch (error) {
    console.error(error);
    return error.response ? error.response.data : { error: "Network Error" };
  }
};

export default {
  login,
  addStudentToBatch,
  createBatch,
  getStudentsInBatch,
  getAllBatches,
  fetchStudents,
  getStudentDetails,
  getBatchDetails,
  fetchCourses,
  deleteBatch,
  deleteStudent,
  updateStudent,
  updateBatch,
  getCourseDetails,
  deleteCourse,
  updateCourse,
  getAllCourses,
  addCourse,
  addStudent
};