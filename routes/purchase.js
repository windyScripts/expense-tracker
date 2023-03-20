const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/purchase-controller')
const authController = require('../controllers/auth-controller')

router.get('/createorder',authController.authorization ,premiumController.premium)
router.post('/updatetransactionstatus',authController.authorization , premiumController.updateTransactionStatus )
module.exports = router;