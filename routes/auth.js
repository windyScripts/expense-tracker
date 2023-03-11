const express = require('express');
const router = express.Router();
const authRoutes = require('../controllers/auth-controller')

router.post('/',authRoutes.addUser);




module.exports = router;