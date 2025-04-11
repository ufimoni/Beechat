import { useState } from "react"; 
import { useEffect } from 'react'; 
import toast from "react-hot-toast"; 
import { useDispatch, useSelector } from "react-redux";
import { createNewMessage, getAllMessage} from '../../../apiCalls/message'
import { hideLoader, showLoader } from "../../../redux/loaderSlice"; 

function ChatArea(){ 
const dispatch = useDispatch(); 
const { selectedChats, user } = useSelector(state => state.userReducer); 
const selectedUser = selectedChats?.members?.find(us => us._id !== user._id);
//// where user stores the current user's id. 
const [ message, setMessage ] = useState(''); 
const [allMessages, setAllMessages ] = useState([]);
const sendMessage = async () => {
       try{ 
      //// call the new message api fucntion
       const newmessage = { 
         chatId: selectedChats._id,
         sender: user._id,
        text: message 
     }
       dispatch(showLoader())
        toast.success("Message sent!"); 
        const response = await createNewMessage(newmessage);
         dispatch(hideLoader())
          if(response.success){
              setMessage('');
          }
      }catch(error){ 
          dispatch(hideLoader()) 
          toast.error(error.message);//// display the message from the backend
           } 
          
}
   
//// a function to getMessages
const getMessages = async () => {
  try{ 

    dispatch(showLoader()) 
   const response = await getAllMessage(selectedChats._id);
    dispatch(hideLoader())
     if(response.success){
         setAllMessages(response.data);
     }
 }catch(error){ 
     dispatch(hideLoader()) 
     toast.error(error.message);//// display the message from the backend
      } 
     
}        
useEffect(() => 
{ 
console.log("selectedChats changed:", selectedChats);
getMessages();
  }, [selectedChats]); 
            ///// before the jsx we create a function above to call the create-new-message-api. 
         return ( 
            <> 
            {selectedChats && <div class="app-chat-area"> <div
            
            class="app-chat-area-header"> 
              {selectedUser?.firstname + " " +selectedUser?.lastname} 
              
              </div> 
              <div className="main-chat-area"> 
                         {
                         allMessages?.map(msg => {
                          /// we must return in other to display it
                          const isCurrentUserSender = msg.sender === user._id;
                           return <div className="message-container" style={isCurrentUserSender? {justifyContent: 'end'} : {justifyContent: 'start'} }>
                           <div className={isCurrentUserSender?"send-message" : "received-message"}>{msg.text}</div>
                       </div>
                         })}
                
                </div> 

                <div className="send-message-div">
                   <input type="text" 
                   className="send-message-input"
                    placeholder="type a message"
                     value={message}
                      onChange={(e)=>{setMessage(e.target.value)}}
                       /> <button className="fa fa-paper-plane send-message-btn"
                        aria-hidden ="true"
                         onClick={ sendMessage }></button>
                          </div> 
                          </div>}
                          </> 
                          ) 
}
 export default ChatArea;