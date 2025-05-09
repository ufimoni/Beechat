const express = require('express')
const authcontrol = require('../controllers/authController');

const router = express.Router();

router.route('/signup')
      .post(authcontrol.signup)

router.route('/login')
      .post(authcontrol.login)

module.exports = router;