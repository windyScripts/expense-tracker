const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/purchase-controller')
const auth = require('../middleware/auth')

router.get('/createorder',auth.authorization ,premiumController.premium)
router.post('/updatetransactionstatus',auth.authorization , premiumController.updateTransactionStatus )

module.exports = router;
