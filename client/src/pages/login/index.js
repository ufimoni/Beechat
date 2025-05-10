
import {useState} from 'react';
import { Link } from 'react-router-dom'
import { LoginUser } from './../../api/auth';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from './../../redux/loaderSlice';
function Login(){
    /// use the usedispathc(). here 
    const dispatch =  useDispatch()
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    async function onFormSubmit(e){
        e.preventDefault();
       let response = null;
       try{
        dispatch(showLoader()); /// display loading 
          response = await LoginUser(user);
          dispatch(hideLoader());
        if(response.success){
            toast.success(response.message);
                localStorage.setItem('token', response.token) // store the jwt in the local storage
              //  window.location.href = "/";
              navigate('/home');
        }else{
            dispatch(hideLoader());
            toast.error(response.message)
        }

       }catch(error){
        dispatch(hideLoader());
         toast.error(response.message);
       }
    }
    return (
        <div>
          <div className="container">
        <div className="container-back-img"></div>
        <div className="container-back-color"></div>
        <div className="card">
        <div className="card_title">
            <h1>Login Here</h1>
        </div>
        <div className="form">
        <form onSubmit={onFormSubmit}>
            <input type="email" placeholder="Email" value={user.email}
            onChange={ (e) => setUser({...user, email: e.target.value})}
            />
            <input type="password" placeholder="Password" value={user.password}
            onChange={ (e) => setUser({...user, password: e.target.value})}
            />
            <button>Login</button>
        </form>
        </div>
        <div className="card_terms"> 
            <span>Don't have an account yet?
                <Link to="/signup">Signup Here</Link>
            </span>
        </div>
        </div>
    </div>
        </div>
    )
    }
    export default Login;
