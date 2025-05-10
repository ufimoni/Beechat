
import moment from 'moment';
import {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { uploadProfilePic } from '././../../api/user';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from './../../redux/loaderSlice';
import toast from 'react-hot-toast'

import { setUser } from './../../redux/userSlice';

import { setUser } from './../../redux/usersSlice';


function Profile(){
  const [image, setImage] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userReducer) || {} ;

  function Abrevations(){
    let fn = user?.firstname.toUpperCase()[0]
    let ln = user?.lastname.toUpperCase()[0] //// here we are getting the index 0 the get the first letters of each
    
    return fn + ln;
     }
     
     function fullname() {
      if (!user?.firstname || !user?.lastname) return '';
      let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
      let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
      return fname + ' ' + lname;
    }
 /// This is an event handler asynchronous function
    const onFileSelect = async (e) =>{
   const file = e.target.files[0];
   const reader = new FileReader(file);
   reader.readAsDataURL(file);
   reader.onload = async () =>{
    setImage(reader.result);
   }
    }
    const UpdatedProfPic = async () =>{
      try{
        dispatch(showLoader())
   const response = await uploadProfilePic(image); // plase always pass the image state
   if(response.success){
    toast.success(response.message);
    // update the user
    dispatch(setUser(response.data))
   }else{
    toast.error(response.message)
   }
        dispatch(hideLoader());
      }catch(error){
        toast(error.message)
        dispatch(hideLoader());
      }
    }

    useEffect(()=>{
      if(user?.profilePic){
        setImage(user.profilePic);
      }
    },[user])

 return (
  <div class="profile-page-container">
  <div class="profile-pic-container">
     {image && <img src={image}
           alt="Profile Pic" 
           class="user-profile-pic-upload" 
      />}

      { !image && <div class="user-default-profile-avatar">
         { Abrevations() }
      </div> }
  </div>

  <div class="profile-info-container">
      <div class="user-profile-name">
          <h1>{ fullname() }</h1>
      </div>
      <div>
          <b>Email: </b> {user?.email}
      </div>
      <div>
          <b>Account Created: </b>{ moment(user?.createdAt).format('MMM, DD, YYYY')}
      </div>
      <div class="select-profile-pic-container">
          <input type="file"  onChange={onFileSelect} />
          <button className='upload-image-btn'
          onClick={UpdatedProfPic}
          >Upload</button>
      </div>
  </div>
</div>
 )
}
export default Profile;
