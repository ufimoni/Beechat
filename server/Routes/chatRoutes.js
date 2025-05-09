const express = require('express');
const authMiddleware = require('./../middlewares/authMiddleware');
const chatControl = require('./../controllers/chatController');


const router = express.Router();

router.route('/create-new-chat')
      .post(authMiddleware,chatControl.CreateNewChats);
router.route('/get-all-chats')
       .get(authMiddleware,chatControl.getAllChats);

router.route('/clear-unread-message')
       .post(authMiddleware, chatControl.ClearChatMessage);       


module.exports = router;