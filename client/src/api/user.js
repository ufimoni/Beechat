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