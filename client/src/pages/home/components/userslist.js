import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CreateChats } from '../../../apiCalls/chat'
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setselectedChats } from "../../../redux/usersSlice";
import moment  from "moment";


function UsersList({searchKey}){
    /// calling the allusers routes from the database.
const { allUsers, allChats, user: currentUser, selectedChats} = useSelector(state => state.userReducer);
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
        dispatch(setselectedChats(updatedChat));
       }
    }catch(error){
     toast.error(response.message);
     dispatch(hideLoader());
    }
}


const getLastMessageTimestamp = (userId) =>{
    const chat = allChats.find(chat => chat.members.map(my => my._id).includes(userId))
    if(!chat && chat?.lastMessage){
      return " ";
    }else{
     //// we will display You and the one who sent the last message.
        return moment(chat?.lastMessage?.createdAt).format('hh:mm A');
    }
}


///// Getting the last message
const GetLastMessage = (userId) =>{
  const chat = allChats.find(chat => chat.members.map(my => my._id).includes(userId))
  if(!chat){
    return "";
  }else{
   //// we will display You and the one who sent the last message.
    const msgPrefx = chat?.lastMessage?.sender === currentUser._id? "You: " : "";

    return msgPrefx + chat?.lastMessage?.text?.substring(0, 25);
  }
}/// display this function into where our email is displayed.





///// remember to keep the selectedUserId
//// the selectedUserId is gotten based on the parametres given.
const openChat = (selectedUserId) =>{
    //// we want to find the chats of the two ids
const chat = allChats.find(chat =>
     chat.members.map(m => m._id).includes(currentUser._id)
&& chat.members.map(m => m._id).includes(selectedUserId))

if(chat){
    dispatch(setselectedChats(chat))
}                             
}

/*
Now this fucntion will be used to prevent all users's div from
beign highlighted in the list.
*/
const isSelectedChat = (user) => {
    if (selectedChats && Array.isArray(selectedChats.members)) {
      // Using map to loop only for the user_id of the selected users.
      return selectedChats.members.map(sc => sc._id).includes(user._id);
    }
    return false;
  };
  

return(
    allUsers.filter(user =>{
        return (
            // The first option is 
            (
            
            user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchKey.toLowerCase())
        ) && searchKey)
         //// this code will make sure it displays only a character is typed there...the second option is 
        ||  (allChats.some(chats => chats.members.map(m => m._id).includes(user._id)))
    })
    
    .map(user => {
        return (
            <div className="user-search-filter" onClick={()=>openChat(user._id)} key={user._id}>
   <div className={ isSelectedChat(user) ? "selected-user": "filtered-user" }>
       <div className="filter-user-display">
           {user.profilePic && <img src={user.profilePic} alt="Profile Pic" class="user-profile-image"/>}
           {!user.profilePic && <div className={ isSelectedChat(user)? "user-selected-avatar" : "user-default-avatar" }>
               { user.firstname.charAt(0).toUpperCase() +
                 user.lastname.charAt(0).toUpperCase()
               }
           </div>}
           <div class="filter-user-details">
               <div class="user-display-name">{user.firstname + " " + user.lastname}</div>
                   <div class="user-display-email">{  GetLastMessage(user._id) || user.email }</div>
               </div>
               <div>{getLastMessageTimestamp(user._id)}</div>
               { 
                 !allChats.find(chats => chats.members.map(m => m._id).includes(user._id)) &&
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