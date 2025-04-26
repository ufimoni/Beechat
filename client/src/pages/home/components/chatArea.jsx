import { useState, useEffect } from "react"; 
import toast from "react-hot-toast"; 
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessage} from '../../../apiCalls/message';
import { hideLoader, showLoader } from "../../../redux/loaderSlice"; 
import { clearunreadMessagecount } from '../../../apiCalls/chat';
import store from '../../../redux/store';

import moment from 'moment';

function ChatArea({socket}) {
  const dispatch = useDispatch();
  const { selectedChats, user, allChats } = useSelector(state => state.userReducer);
  const selectedUser = selectedChats?.members?.find(us => us?._id !== user?._id);
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);


  // Function to send a new message
  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty!");
      return;
    }
    try {
      const newMessage = {
        chatId: selectedChats?._id,
        sender: user?._id,
        text: message
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
      dispatch(showLoader());
      const response = await getAllMessage(selectedChats._id);
      dispatch(hideLoader());
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
    dispatch(hideLoader());
    toast.error(error.message || "An error occurred!");
  }
};






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
  socket.off('receive-message').on('receive-message', (data) =>{
    const selectedChats = store.getState().userReducer.selectedChats;
    if(selectedChats._id === data.chatId){
      setAllMessages(prevmsg => [...prevmsg,data])
    }
   
  })
  }, [selectedChats]);
/// creating an atimatic scroll effect.


  // Render the component
  return (
    <>
      {selectedChats ? (
        <div className="app-chat-area">
          <div className="app-chat-area-header">
            {FormatName(selectedUser)}
          </div>
          <div className="main-chat-area">
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
                      {msg.text}
                    </div>
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

          <div className="send-message-div">
            <input 
              type="text" 
              className="send-message-input" 
              placeholder="Type a message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              className="fa fa-paper-plane send-message-btn" 
              aria-hidden="true" 
              onClick={sendMessage}
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
