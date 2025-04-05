
import { useDispatch, useSelector } from "react-redux";
import './Header.css';

function Header(){
const { user } = useSelector(state => state.userReducer);

 function fullname(){
 let fname = user?.firstname.toUpperCase();
 let lname = user?.lastname.toUpperCase();

 return fname + " " + lname;
 }
 function Abrevations(){
let fn = user?.firstname.toUpperCase()[0]
let ln = user?.lastname.toUpperCase()[0] //// here we are getting the index 0 the get the first letters of each

return fn + ln;
 }
return(
    <div className="app-header">
    <div className="app-logo">
        <i className="fa fa-comments" aria-hidden="true"></i>
          Bee Chat
        </div>
    <div className="app-user-profile">
        <div className="logged-user-name">{fullname()}</div>
        <div className="logged-user-profile-pic">{Abrevations()}</div>
    </div>
</div>
)

}
export default Header;