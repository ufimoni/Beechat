import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getLoggedUser, getAllUsers } from "../apiCalls/user";
import { getAllchats } from "../apiCalls/chat";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setAllUsers, setUser, setAllChats } from "../redux/usersSlice";
import toast from 'react-hot-toast';

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userReducer);
  const navigate = useNavigate();

  const getLoggedInUser = async () => {
    let response = null;
    try {
      dispatch(showLoader());
      console.log("Fetching logged-in user...");
      response = await getLoggedUser();
      console.log("Response from getLoggedUser:", response);
      dispatch(hideLoader());
      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
        navigate('/login');
      }
    } catch (error) {
      console.log("Error fetching logged-in user:", error);
      toast.error(error.message);
      navigate('/login');
    }
  };
  
  const getAllInUsers = async () => {
    let response = null;
    try {
      dispatch(showLoader());
      console.log("Fetching logged-in user...");
      response = await getAllUsers();
      console.log("Response from getLoggedUser:", response);
      dispatch(hideLoader());
      if (response.success) {
        dispatch(setAllUsers(response.data));
      } else {
        toast.error(response.message);
        navigate('/login');
      }
    } catch (error) {
      console.log("Error fetchng get all users:", error);
      toast.error(error.message);
      navigate('/login');
    }
  };
 
  const getChatsfromDb = async () =>{
    
try{
const response = await getAllchats();
if(response.success){
  dispatch(setAllChats(response.data)) //// where response.data is the payload and data is storing our chats from the backend
}
}catch(error){
  // toast.error(response.message);
  navigate('/login');
}
  };
  




 ////only logged in user get access.
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log("Token in localStorage:", token);
    if (token) {
      getLoggedInUser();
      getAllInUsers();
      getChatsfromDb();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      {children}
    </div>
  );
}

export default ProtectedRoute;
