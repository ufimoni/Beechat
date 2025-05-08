
import { useDispatch, useSelector } from "react-redux";
import './Header.css';
import { useNavigate } from "react-router-dom";

function Header({socket}){
const { user } = useSelector(state => state.userReducer);
const navigate = useNavigate();
 function fullname(){
    let fname = user?.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
    let lname = user?.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
    
    return fname+ ' ' +lname


 }
 function Abrevations(){
let fn = user?.firstname.toUpperCase()[0]
let ln = user?.lastname.toUpperCase()[0] //// here we are getting the index 0 the get the first letters of each

return fn + ln;
 }
const Logout = () =>{
localStorage.removeItem('token');
navigate('/login');
/// To make sure logout users are offline
socket.emit('user-offline', user._id)

}

 return (
    <div className="app-header">
      <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
        Bee Chat
      </div>
      {user ? (
        <div className="app-user-profile">
          <div className="logged-user-name">{fullname()}</div>
          {user?.profilePic && <img src={user.profilePic} alt="ProfilePic" className="logged-user-profile-pic" onClick ={ ()=> navigate('/profile')}/>}
         {  !user?.profilePic && <div className="logged-user-profile-pic" onClick ={ ()=> navigate('/profile')}>{Abrevations()}</div>}
         {/*Logout button*/}
          <button className="btn-power-off" onClick={ Logout}>
            <i className="fa fa-power-off"></i>
          </button>
       
        </div>
      ) : (
        <div className="guest-profile">
          Welcome, Guest!
        </div>
      )}
    </div>
  );
  

}
export default Header;