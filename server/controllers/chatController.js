const Users = require('./../models/usermodel');
const Chats = require('../models/chatmodel');
const jwt = require('jsonwebtoken');

exports.CreateNewChats = async (req, res)=>{
  try{  
    const chat = new Chats(req.body)
    const savedChat = await chat.save();
   res.status(201).send({
    message: "Chat Created Successfully",
    success: true,
    data: savedChat
   })


  }catch(error){
    res.status(400).send({
        message: error.message,
        success: false
    })
  }
}
exports.getAllChats = async (req, res) =>{
    try{
     //  const user_id = 
   const allchat = await Chats.find({ members: { $in: req.body.userId}})
                      .populate('members').sort({updatedAt: -1})
   console.log("User ID: ", req.body.userId);

   res.status(200).send({
    status: 200,
    message: "Chat Fetched Successfully",
    success: true,
    data: allchat
   })


    }catch(error){
    res.status(400).send({
        status: 400,
        message: "Failed in getting all the chats, try again later",
        success: false,
        error: error.message
    })
    }
}