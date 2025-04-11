const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
   type: String,
   required: true
    },
    lastname:{
      type: String,
      required: true
    },
    email:{
     type: String,
     required: true
    },
    password:{
      type: String,
      required: true,
      minlength: 8
    },
    profilePic:{
     type: String,
     required: false
    }
},{timestamps: true})
/// Modelling our Schema so that it can be saved in db
const Users = mongoose.model('users',userSchema);

module.exports = Users; ///exporting it