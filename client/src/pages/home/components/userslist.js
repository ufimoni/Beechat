import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CreateChats } from '../../../apiCalls/chat'
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setselectedChats } from "../../../redux/usersSlice";
import moment  from "moment";
import { useEffect } from "react";
import store from '../../../redux/store'


function UsersList({searchKey, socket, onlineUsers}){
    /// calling the allusers routes from the database.
const { allUsers, allChats, user: currentUser, selectedChats} = useSelector(state => state.userReducer);
/// so inside the createchat function we will pass 2 arguements 
//////1
const dispatch = useDispatch();
///1. First
const StartNewChat = async (searchedUserId) => {
  let response = null;
  try {
    dispatch(showLoader());
    response = await CreateChats([currentUser._id, searchedUserId]); // This function expects an array
    dispatch(hideLoader());

    if (response.success) {
      toast.success(response.message);
      const newChat = response.data;

      // Find the user to populate selectedChats
      const selectedUser = allUsers.find(user => user._id === searchedUserId);

      const updatedChat = [...allChats, newChat]; // Keep old chats and add new chat
      dispatch(setAllChats(updatedChat));

      // Set selectedChats with full data (chat and user details)
      dispatch(setselectedChats({ ...newChat, members: [...newChat.members, selectedUser] }));
    }
  } catch (error) {
    toast.error(response.message || "An error occurred!");
    dispatch(hideLoader());
  }
};


////2.
const getLastMessageTimestamp = (userId) =>{
    const chat = allChats.find(chat => chat.members.map(my => my._id).includes(userId))
    if(!chat || chat?.lastMessage){
      return " ";
    }else{
     //// we will display You and the one who sent the last message.
        return moment(chat?.lastMessage?.createdAt).format('hh:mm A');
    }
}

////3.
///// Getting the last message
const GetLastMessage = (userId) => {
    const chat = allChats.find(chat => chat.members.map(my => my._id).includes(userId));
    if (!chat || !chat.lastMessage) {
      return "";
    } else {
      const msgPrefx = chat?.lastMessage?.sender === currentUser._id ? "You: " : "";
      return msgPrefx + chat?.lastMessage?.text?.substring(0, 25);
    }
  };
  const GetUnreadMessageCount = (userId) =>{
    const chat = allChats.find(chat => chat.members.map(m => m._id).includes(userId));
    if(chat && chat.unReadMessageCount && chat.lastMessage.sender !== currentUser._id){
    return <div className="unread-message-counter"> {chat.unReadMessageCount} </div>
    }
  else{
        return "";
    }
  }
/////4.
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
  

function FormatName(user){
let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();

return fname+ ' ' +lname
} 


///// Display the latest updated message sent to the current user who is selecetd
function getData() {
  if (searchKey === "") {
    return allChats;
  } else {
    return allUsers
      .filter(user =>
        user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
        user.lastname.toLowerCase().includes(searchKey.toLowerCase())
      )
      .map(user => {
        // Find chat for this user
        const chat = allChats.find(chat =>
          chat.members.some(m => m._id === user._id)
        );
        return chat ? chat : { members: [user] }; // Return placeholder chat if none exists
      });
  }
}

//// when ever a new message is recieved while chatting with another user. unread message should be displayed
useEffect(() =>{
socket.on('receive-message', (message) =>{
const selectedChats = store.getState().userReducer.selectedChats || {}
let allChats = store.getState().userReducer.allChats 
if (selectedChats && selectedChats?._id !== message?.chatId) {
  const updatedChat = allChats.map(chat => {
    if(chat?._id === message?.chatId){ 
       return {
        ...chat,
        unReadMessageCount: (chat?.unReadMessageCount || 0 ) + 1,
        lastMessage: message
       }
    }else{
      return chat;
      }
  }); 
  allChats = updatedChat;
  
}
//1. Find the Latest Chat
const latestChat = allChats.find(chat => chat._id === message.chatId)
//2. Get All Other chats
const OtherChats = allChats.filter(chat => chat._id !== message.chatId)
//3. Create a new array latest chat on top and then other chats below
allChats = [latestChat, ...OtherChats];
dispatch(setAllChats(allChats))
})
}, [])



return(
    
  getData()
    .map(obj => {
      let user = obj;
      if(obj.members){
        user = obj.members.find(mem => mem._id !== currentUser._id)
      }
      if(!user) return null;
        return (

  <div className="user-search-filter"
   onClick={()=>openChat(user._id)} 
   key={user._id}>
  <div className={ isSelectedChat(user) ? "selected-user": "filtered-user" }>
       <div className="filter-user-display">{user.profilePic && 
                <img src={user.profilePic} 
                 alt="Profile Pic" 
                 className="user-profile-image"
                 style={onlineUsers.includes(user._id)? {border: '#82e0aa 3px solid'} : {} }
       />}
           {!user.profilePic && 
           <div className={ isSelectedChat(user)? "user-selected-avatar" : "user-default-avatar"}
           style={onlineUsers.includes(user._id)? {border: '#82e0aa 3px solid'} : {} }

          >
               { user.firstname.charAt(0).toUpperCase() +
                 user.lastname.charAt(0).toUpperCase()
               }
           </div>}
           <div class="filter-user-details">
               <div class="user-display-name">{FormatName(user)}</div>
                   <div class="user-display-email">{  GetLastMessage(user._id) || user.email }</div>
               </div>
                      

                  {/*------------This div carries both get UnreadMessage Count and 
                    timestamps----------------------------------------------------
                  -------------*/}   
                <div> 
               { GetUnreadMessageCount(user._id) } 
               <div className="last-message-timestamp">{getLastMessageTimestamp(user._id)}</div>
              </div> 
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