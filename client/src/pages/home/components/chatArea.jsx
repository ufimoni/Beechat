import { useState, useEffect } from "react"; 
import toast from "react-hot-toast"; 
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessage} from './../../../api/message';
import { hideLoader, showLoader } from "./../../../redux/loaderSlice"; 
import { clearunreadMessagecount } from './../../../api/chat';
import store from './../../../redux/store';

import EmojiPicker from 'emoji-picker-react'

import moment from 'moment';
import { setAllChats } from "../../../redux/usersSlice";


function ChatArea({socket}) {
  const dispatch = useDispatch();
  const { selectedChats, user, allChats } = useSelector(state => state.userReducer);
  const selectedUser = selectedChats?.members?.find(us => us?._id !== user?._id);
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);
  const [ data, setData] = useState(null);

  // Function to send a new message
  /// and also images which was modified the image will be passed as parameter
  const sendMessage = async (image) => {
    if (!message.trim() && !image) {
      toast.error("Message cannot be empty!");
      return;
    }
    try {
      const newMessage = {
        chatId: selectedChats?._id,
        sender: user?._id,
        text: message,
        image: image
      };
  socket.emit('send-message', {
    ...newMessage,
       members: selectedChats.members.map(m => m._id),
       read: false,
       createsAt: moment().format('DD-MM-YYYY hh:mm:ss')

      })
      const response = await createNewMessage(newMessage);
      if (response.success) {
        setMessage('');
        getMessages(); // Refresh messages after sending
      } else {
        toast.error("Failed to send message!");
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message || "An error occurred!");
    }
  };

  // Function to format timestamps
  const formatTime = (timestamp) => {
    const now = moment();
    const formattedTimestamp = moment(timestamp);
    if (formattedTimestamp.isSame(now, 'day')) {
      return `Today ${formattedTimestamp.format('hh:mm A')}`;
    } else if (formattedTimestamp.isSame(now.clone().subtract(1, 'day'), 'day')) {
      return `Yesterday ${formattedTimestamp.format('hh:mm A')}`;
    } else {
      return formattedTimestamp.format('MMMM D, YYYY hh:mm A');
    }
  };

  // Function to fetch all messages
  const getMessages = async () => {
    if (!selectedChats?._id) return;
    try {
      const response = await getAllMessage(selectedChats._id);

      if (response.success) {
        setAllMessages(response.data);
      } else {
        toast.error("Failed to fetch messages!");
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message || "An error occurred!");
    }
  };


///// Clearing the UnreadMessage Count
const ClearedUnreadMessages = async () => {
  if (!selectedChats?._id) return;
  try {
      socket.emit('clear-unread-messages', {
        chatId: selectedChats._id,
        members: selectedChats.members.map(m => m._id)
      })
    const response = await clearunreadMessagecount(selectedChats._id);
    if (response.success) {
      allChats.map(chat => {
        //// checking if the selectedChat matches the ID.
        if(chat._id === selectedChats._id){
          toast.success(response.message);
          return response.data
        }
        return chat; /// just return the chat without changing anything
      })
    

    } else {
      toast.error("Failed to fetch messages!");
    }
  } catch (error) {
    toast.error(error.message || "An error occurred!");
  }
};
 //// To send Image
const sendImage = async (e) =>{
const file = e.target.files[0];
const reader = new FileReader(file);

reader.readAsDataURL(file);

reader.onloadend = async () =>{
  sendMessage(reader.result);
}
} 


  // Format the selected user's full name
  const FormatName = (user) => {
    if (!user?.firstname || !user?.lastname) return "Unknown User";
    const fname = user.firstname[0].toUpperCase() + user.firstname.slice(1).toLowerCase();
    const lname = user.lastname[0].toUpperCase() + user.lastname.slice(1).toLowerCase();
    return `${fname} ${lname}`;
  };

  // Effect to fetch messages when selectedChats changes
  useEffect(() => {
    getMessages();
  if(selectedChats?.lastMessage?.sender && selectedChats.lastMessage.sender !== user._id){
    ClearedUnreadMessages();
  }// here we want the unread message cleared when the reciever recieves it.
  //// listening to the receive-message event
  socket.on('receive-message', (message) =>{
    const selectedChats = store.getState().userReducer.selectedChats;
    if(selectedChats?._id === message.chatId){
      setAllMessages(prevmsg => [...prevmsg, message])
    }
    else if(selectedChats?._id === message.chatId && message.sender !== user._id){
    clearunreadMessagecount();
    }
   socket.on('message-count-cleared', data =>{
    const selectedChats = store.getState().userReducer.selectedChats;
    const allChats = store.getState().userReducer.allChats;
    /// checking of the selectedChat matches the incoming chat array stord in the data variable.
    if(selectedChats._id === data.chatId){
      //// updating the unread message count
      const updatedchat = allChats.map(chat =>{
        if(chat._id === data.chatId){
        return {
          ...chat,
          unreadMessageCount: 0
        }
        }
          return chat;
      
      })
      
     dispatch(setAllChats(updatedchat))
      ////// Updating the read property in the message Object.
       setAllMessages(prevmsg =>{
        return prevmsg.map(msg => {
                return { ...msg, read: true}
        })
       })


    } 
   })
  })

    /// handling the started typing
    socket.on('started-typing',(data)=>{
      if(selectedChats._id === data.chatId && data.sender !== user._id){
        setIsTyping(true);
        setTimeout(()=>{
          setIsTyping(false);
        }, 3000)
      }
     })
  }, [selectedChats]);
/// creating an automatic scroll effect.
useEffect(() =>{
  const msgController = document.getElementById('main-chat-area')
        msgController.scrollTop = msgController.scrollHeight;
}, [allMessages])

  // Render the component
  return (
    <>
      {selectedChats ? (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {FormatName(selectedUser)}
          </div>
          <div className="main-chat-area" id="main-chat-area">
            {allMessages?.map(msg => {
              const isCurrentUserSender = msg.sender === user?._id;
              return (
                <div 
                  key={msg._id} 
                  className="message-container"
                  style={isCurrentUserSender ? { justifyContent: 'end' } : { justifyContent: 'start' }}
                >
                  <div>
                    <div className={isCurrentUserSender ? "send-message" : "received-message"}>
                      <div>{msg.text}</div> {/*wrap it within a div*/}
                    </div>
                     {/*This code will enable users to send images*/}
                      <div> {msg.image && <img src={msg.image} alt="image" height='120' width='120'/>} </div>
              
                    <div 
                      className="message-timestamps" 
                      style={isCurrentUserSender ? { float: 'right' } : { float: 'left' }}
                    >
                      {formatTime(msg.createdAt)} 
                      {isCurrentUserSender && msg.read && <i className="fa fa-check-circle"
                       aria-hidden="true" 
                       style={{color: '#4796ff'}}>
                        </i>}
                    </div> 
                  </div>
                </div>
              );
            })}
          </div>
            {/*Display a typing indicator*/}
            {/*an additional code to display typing indicator to only when a chat is selected*/}
                      <div className="typing-indicate">{ isTyping && selectedChats?.members.map(mi => mi._id).
                                                            includes(data?.sender) && <i>typing...</i>}</div> 
               {/*Display the Emojis here*/}
            { 
              showEmojiPicker &&
              <div className="send-message-wrapper" style={{ position: 'absolute',
                bottom: '60px', // Adjust height above input box
                right: '80px',
                zIndex: 1000,
                boxShadow: '0 0 10px rgba(0,0,0,0.2)'}}> 
              <EmojiPicker onEmojiClick={(e) => setMessage(message + e.emoji)}/> 
          </div>
            }  
          <div className="send-message-div">
            <input 
              type="text" 
              className="send-message-input" 
              placeholder="Type a message" 
              value={message}
              onChange={(e) => {  setMessage(e.target.value)
              socket.emit('user-typing', {
                chatId: selectedChats._id,
                members: selectedChats.members.map(m => m._id),
                sender: user._id // we are storing the id of the curremt sender
              })

              }}
            /> 
            {/*Enable users to be able to send message we use an i class*/}
            <label htmlFor="file">
            <i className="fa fa-picture-o send-image-btn"></i>
             {/*Create an input that will not be visible to accept images
            this input will not be seen
            */}
             <input type="file"
              id="file"
              style={{display: 'none'}}
              accept="image/jpg,image/jpeg,image/png,image/gif,image/webp"
              onChange={sendImage}
             />
            </label>
        
             <button 
              className="fa fa-smile-o send-emoji-btn" 
              aria-hidden="true" 
              onClick={()=>{setshowEmojiPicker(!showEmojiPicker)}}
            ></button>
            <button 
              className="fa fa-paper-plane send-message-btn" 
              aria-hidden="true" 
              onClick={ ()=> sendMessage('')}
            ></button>
          </div>
        </div>
      ) : (
        <div className="no-chat-selected">Please select a chat to start messaging.</div>
      )}
    </>
  );
}

export default ChatArea;
