const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premium-controller')
const authController = require('../controllers/auth-controller')

router.get('/leaderboard',premiumController.showLeaderboards);

module.exports = router;

router.get('/download',authController.authorization, premiumController.getPDFLink)