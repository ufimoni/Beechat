const express = require('express');
const authMiddleware = require('./../middlewares/authMiddleware');
const userControl = require('./../controllers/userController')

const router = express.Router();

router.route('/get-logged-user')
      .get(authMiddleware, userControl.getUserDetail);

router.route('/get-All-users')
       .get(authMiddleware, userControl.getAllUsers);
module.exports = router;