const express = require('express');
const morgan = require('morgan');
const {createProxyMiddleware } = require('http-proxy-middleware');
const authrouter = require('./Routes/authRoutes')
const cors = require('cors');
const userRouter = require('./Routes/userRoutes')
const chatrouter = require('./Routes/chatRoutes')
const messageRouter = require('./Routes/messageRoutes');
const app = express();
// convert the incoming json data in js object

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

//app.use(morgan('dev'))
app.use(cors()); /// for deployment in the production server.
const server = require('http').createServer(app); /// for the http only
//// create the socket.io connection

const io = require('socket.io')(server, {cors:{
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
} })


const corsOptions = {
    origin: 'http://localhost:3000', // Replace this with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true, // Allow cookies to be sent
  };

const onlineUsers = [];

app.use(cors(corsOptions))

//use the router
app.use('/api/auth',authrouter)
app.use('/api/user',userRouter)
app.use('/api/chat',chatrouter)
app.use('/api/message',messageRouter);
app.use('/api',createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true
}))

//// TEST THE SOCKET CONNECTION FROM CLIENT
io.on('connection', socket => {
//   /// go to the frontend and copy the URL. 
// socket.on('send-message-all', data =>{
//   //// emiting the events back to the client
//   socket.emit('send-message-by-server', "Message From the server: " + data.text);
// })
socket.on('join-room', userId =>{
  socket.join(userId)

})
socket.on('send-message', (message) => {
  console.log(message)
  io
  .to(message.members[0])
  .to(message.members[1])
  .emit('receive-message', message)
})
socket.on('clear-unread-messages', data =>{
  io.to(data.members[0])
    .to(data.members[1])
    .emit('message-count-cleared', data)
}) /// this code will be handled by useEffect() in frontend to complete the circle

/// socket for handling the typing-message event
socket.on('user-typing', (data)=>{
  io
  .to(data.members[0])
  .to(data.members[1])
  .emit('started-typing', data)
})
/*Here we to add it to all Online users 
that is why we are pushing the data to the array.*/
socket.on('user-login', UserId =>{
if(!onlineUsers.includes(UserId)){
  onlineUsers.push(UserId)
}
socket.emit('online-user',onlineUsers); // we pass the onlineUsers array as the second parameter.
})

//// filter out or remove offline users
socket.on('user-offline', userId =>{
  onlineUsers.splice(onlineUsers.indexOf(userId), 1)
  io.emit('online-users-active',onlineUsers);
})
})
/// export serer.
module.exports = server; 
