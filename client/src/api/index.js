import axios from 'axios';
export const url = "https://beechat-server.onrender.com";
/// creating the instance of the axios
export const axiosInstance = axios.create({
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
   
});
