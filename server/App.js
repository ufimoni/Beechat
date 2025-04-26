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
app.use(express.json());

const server = require('http').createServer(app); /// for the http only
//// create the socket.io connection

const io = require('socket.io')(server, {cors:{
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST']
} })

app.use(morgan('dev'))
app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000', // Replace this with your frontend URL
    methods: 'GET,POST,PUT,DELETE', // Allowed methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
    credentials: true, // Allow cookies to be sent
  };

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
})
module.exports = server; 