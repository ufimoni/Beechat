const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const dbconfig = require('./config/dbconfig');

const server = require('./app');

const port = process.env.port
server.listen(port, ()=>{
    console.log("Server Running on port: " +port);
})