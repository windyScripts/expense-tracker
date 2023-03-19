const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premium-controller')

router.get('/leaderboard',premiumController.showLeaderboards);

module.exports = router;