import axios from 'axios';
<<<<<<< HEAD
export const url = "https://beechat-server.onrender.com"; // keep this url
=======
export const url = "https://beechat-server.onrender.com";
>>>>>>> bfed02845494ceeae854423f810864fd1a1822e6
/// creating the instance of the axios
export const axiosInstance = axios.create({
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
   
});
