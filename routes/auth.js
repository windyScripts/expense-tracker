const express = require('express');
const router = express.Router();
const authRoutes = require('../controllers/auth-controller');

router.post('/new',authRoutes.addUser);
router.post('/login',authRoutes.login);



module.exports = router;