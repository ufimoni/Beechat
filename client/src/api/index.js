import axios from 'axios';
export const url = "http://localhost:5000";
/// creating the instance of the axios
export const axiosInstance = axios.create({
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
   
});