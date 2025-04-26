const dotenv = require('dotenv');
dotenv.config({path: './config.env'})

const dbconfig = require('./config/dbconfig');

const server = require('./App');

const port = process.env.port
server.listen(port, ()=>{
    console.log("Server Running on port: " +port);
})