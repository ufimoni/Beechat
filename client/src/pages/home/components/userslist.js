import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CreateChats } from '../../../apiCalls/chat'
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats } from "../../../redux/usersSlice";
function UsersList({searchKey}){
    /// calling the allusers routes from the database.
const { allUsers, allChats, user: currentUser} = useSelector(state => state.userReducer);
/// so inside the createchat function we will pass 2 arguements 
//////1
const dispatch = useDispatch();
const StartNewChat = async (searchedUserId) =>{
    let response = null;
    try{
        dispatch(showLoader());
        response =  await CreateChats([currentUser._id,searchedUserId]);  /// this fumcton is called from the api and it is expecting an array
        dispatch(hideLoader());

        /*
        1. check if the create chat request is successfull
        2. Update the setAllchat functions. that is updating the changes made in the all chats.
        */
       if(response.success){
        toast.success(response.message);
        const newchat = response.data;
        const updatedChat = [...allChats, newchat]; //// ....allChats keeps the data of old chat and newChat variale stores the data of the new chat
        dispatch(setAllChats(updatedChat));
       }
    }catch(error){
     toast.error(response.message);
     dispatch(hideLoader());
    }
}
return(
    allUsers.filter(user =>{
        return (
            // The first option is 
            (
            
            user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchKey.toLowerCase())
        ) && searchKey)
         //// this code will make sure it displays only a character is typed there...the second option is 
        ||  (allChats.some(chats => chats.members.includes(user._id)))
    })
    
    .map(user => {
        return (
            <div class="user-search-filter">
   <div class="filtered-user">
       <div class="filter-user-display">
           {user.profilePic && <img src={user.profilePic} alt="Profile Pic" class="user-profile-image"/>}
           {!user.profilePic && <div class="user-default-profile-pic">
               { user.firstname.charAt(0).toUpperCase() +
                 user.lastname.charAt(0).toUpperCase()
               }
           </div>}
           <div class="filter-user-details">
               <div class="user-display-name">{user.firstname + " " + user.lastname}</div>
                   <div class="user-display-email">{user.email || 'No Email at all '}</div>
               </div>
               { 
                 !allChats.find(chats => chats.members.includes(user._id)) &&
               <div class="user-start-chat">
                  <button class="user-start-chat-btn" 
                  onClick={()=> {StartNewChat(user._id)}}
                  >Start chat</button>
               </div>}
           </div>
       </div>                        
   </div>
        )
    })
)
}
export default UsersList;