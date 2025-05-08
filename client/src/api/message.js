import {axiosInstance, url} from './index';
export const createNewMessage = async ( message ) =>{
    try{
        //// get the api from the backend
        const response = await axiosInstance.post(url+ '/api/message/new-message', message) /// where the member object is an array.
        return response.data
    }catch(error){
        console.log(error);
        return error;
    }
}

export const getAllMessage = async ( chatId ) =>{
    try{
        //// get the api from the backend
        const response = await axiosInstance.get(url +`/api/message/get-All-Messages/${chatId}`) /// where the member object is an array.
        return response.data
    }catch(error){
        console.log(error);
        return error;
    }
}