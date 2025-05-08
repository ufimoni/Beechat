import { axiosInstance, url } from "./index";

export const getAllchats = async () =>{
    try{
        //// get the api from the backend
        const response = await axiosInstance.get(url+ '/api/chat/get-all-chats')
        return response.data
    }catch(error){

        console.log(error);
        return error;
    }
}
//// memeber is from the backend
export const CreateChats = async ( members ) =>{
    try{
        //// get the api from the backend
        const response = await axiosInstance.post(url + '/api/chat/create-new-chat', { members }) /// where the member object is an array.
        return response.data
    }catch(error){
        console.log(error);
        return error;
    }
}
export const clearunreadMessagecount = async ( chatId ) =>{
    try{
        //// get the api from the backend
        const response = await axiosInstance.post( url+ '/api/chat/clear-unread-message', { chatId }) /// where the member object is an array.
        return response.data
    }catch(error){
        console.log(error);
        return error;
    }
}