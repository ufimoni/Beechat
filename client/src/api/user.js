import {axiosInstance} from './index';

export const getLoggedUser = async () =>{
    try{
        /// get this url postman 
    const response = await axiosInstance.get('api/user/get-logged-user'); /// from postman.
    return response.data;
    }catch(error){
         return error;
    }
}
export const getAllUsers = async () =>{
    try{
        /// get this url postman 
    const response = await axiosInstance.get('api/user/get-All-users'); /// from postman.
    return response.data;
    }catch(error){
         return error;
    }
}