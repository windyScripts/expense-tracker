const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/password-controller')
const authController = require('../controllers/auth-controller')

router.post('/forgotpassword', passwordController.forgotPassword)
router.get('resetpassword/:reqId',passwordController.getPasswordUpdateForm)
module.exports = router;
router.get('updatepassword/:resetpasswordid',passwordController.setPassword)