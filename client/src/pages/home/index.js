import React, { useEffect, useState } from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import ChatArea from './components/chatArea';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client'

const socket = io('https://beechat-server.onrender.com'); //// connection to the server
function Home(){
  const { selectedChats, user } = useSelector(state => state.userReducer)
   const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() =>{
    if(user){
      socket.emit('join-room', user._id);
      socket.emit('user-login', user._id);
      socket.on('online-user', online_User =>{
        setOnlineUsers(online_User)
      })
      socket.on('online-users-active', online_User =>{
        setOnlineUsers(online_User)
      })
  
    }
    /// emitting an event to the server
    // socket.emit('send-message-all', {text: 'Hi from Ramos'})

    // //// Receving an event from the server
    // socket.on('send-message-by-server', data => {
    //   console.log(data);
    // })
  }, [user, onlineUsers]) /// this useeffect will run as soon as the home components is rendered
return(
    <div className='home-page'>
      <Header socket={socket}/>
          <div className="main-content">
          <Sidebar socket={socket} onlineUsers={onlineUsers}/>
             {/*This is the Chat Area Layout*/}
             { selectedChats && <ChatArea socket={socket}/> }
            </div> 
    </div>
)
}
export default Home;
