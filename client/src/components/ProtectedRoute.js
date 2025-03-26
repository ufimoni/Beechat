import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getLoggedUser } from "../apiCalls/user";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

/*This code is protected function that allows only login user to access the dashboard.*/
function ProtectedRoute({ children }){
  const dispatch  = useDispatch();
  const [user,setUser] = useState(null);
  const navigate = useNavigate();

  const getLoggedInUser = async () =>{
    let response = null;
    try{
      dispatch(showLoader());
      response = await getLoggedUser(); // await the logged user from the server.
      dispatch(hideLoader());
      if(response.success){
       setUser(response.data)
      }else{
        navigate('/login')
      }
    }catch(error){
      navigate('/login');
    }
  }
  useEffect(()=>{
    if(localStorage.getItem('token')){
      //// writing the logic to access this hoe route or do something inside our application.
       // call the loggedInuser ()
       getLoggedInUser();
    }else{
        navigate('/login');
    }
  });
  /*remeber t always return this functin
  */
     return ( 
      
     <div>
      <p>Name: { user?.firstname + ' ' + user?.lastname }</p>
      <p>Email: {user?.email}</p>
      {children}
      
      </div>
    )
}
export default ProtectedRoute;