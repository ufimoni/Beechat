import axios from 'axios';
/// creating the instance of the axios
export const axiosInstance = axios.create({
    headers:{
        authorization: `Bearer ${localStorage.getItem('token')}`
    },
    baseUrl: 'http://localhost:5000'
});
