import axios from 'axios';

export const url = "https://beechat-server.onrender.com"; // keep this url
/// creating the instance of the axios
export const axiosInstance = axios.create({
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
   
});
