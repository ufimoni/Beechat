
const Chats = require('../models/chatmodel');
const Messages = require('../models/messagemodel');

exports.CreateNewChats = async (req, res)=>{
  try{  
    const chat = new Chats(req.body)
    const savedChat = await chat.save();
    await savedChat.populate('members');
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
                      .populate({
                        path: 'members',
                        select: '-password'
                      })
                      .populate('lastMessage')
                      .sort({updatedAt: -1})
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

exports.ClearChatMessage = async (req, res) =>{
try{
////// recieve the chatId
const chatId = req.body.chatId;

const chat = await Chats.findById(chatId);
///// checking if the chat exits
if(!chat){
  res.send({
    success: false,
    message: "Sorry There is no chat found with the given ID"
  })
}
else{
  const UpdatedChat = await Chats.findByIdAndUpdate(
    chatId,
    {unReadMessageCount: 0},
    {new: true}
  ).populate('members').populate('lastMessage')

  //// to update multiple documents
  await Messages.updateMany(
    {chatId: chatId,
      read: false
    },
    {read: true}
  )
  res.send({
    message: "Unread Message Cleared Successfully",
    success: true,
    data: UpdatedChat
  })
}

}catch(error){
  res.send({
    message: error.message,
    success: false
  })
}
}