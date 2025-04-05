const express = require('express');
const morgan = require('morgan');
const {createProxyMiddleware } = require('http-proxy-middleware');
const authrouter = require('./Routes/authRoutes')
const cors = require('cors');
const userRouter = require('./Routes/userRoutes')
const chatrouter = require('./Routes/chatRoutes')
const messageRouter = require('./Routes/messageRoutes');
const app = express();
// convert the incmonig json data in js object
app.use(express.json());

//app.use(morgan('dev'))
app.use(cors());

//use the router
app.use('/api/auth',authrouter)
app.use('/api/user',userRouter)
app.use('/api/chat',chatrouter)
app.use('/api/message',messageRouter);
app.use('/api',createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true
}))


module.exports = app;