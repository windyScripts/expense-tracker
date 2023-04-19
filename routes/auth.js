const express = require('express');
const router = express.Router();
const authRoutes = require('../controllers/user-controller');

// new user registration

router.post('/new',authRoutes.addUser);

// user login

router.post('/login',authRoutes.login);

module.exports = router;
