const mongoose = require('mongoose');

//// Connection logic
mongoose.connect(process.env.Conn_Str);

///Testing connection
const db = mongoose.connection;
/// listening to the connections coming.
db.on('connected',()=>{
    console.log("Database Connected Successfully!")
})
 
/// checking for error
db.on('err',()=>{
console.log("Error in connecting to the database");
})

module.exports = db;