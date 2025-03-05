import axios from "axios";

// Create an Axios instance
const API = axios.create({
  baseURL: "http://localhost:3001/api", 
  withCredentials: true, 
});


async function login(data) {
    try {
        const response = await API.post("/adminLogin",data)
        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
}



export default {
    login,

};
