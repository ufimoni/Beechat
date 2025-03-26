import {axiosInstance} from './index'
/// we set the user obj and the parameter that will recieve the respone data.
/*This codeis the authentication login from the client before going to the backend
Now user is an object that will received the req.body data that will be sent and recieved.*/
export const signupUser = async (user)=>{
    try{
       const response = await axiosInstance.post('/api/auth/signup', user);
       return response.data
    }catch(error){
        return error;
    }
}

//// for the Login business logic
export const LoginUser = async ( user ) =>{
    try{
     const response = await axiosInstance.post('/api/auth/login', user);
     return response.data
    }catch(error){
        return error;
    }
}