const express = require('express');
const router = express.Router();

const authController = require('../controllers/user-controller')
const expensesController = require('../controllers/expenses-controller');
const premiumController = require('../controllers/downloads-controller')

router.get('/entries', authController.authorization ,expensesController.getExpenses);
router.post('/entry', authController.authorization ,expensesController.addExpense);
router.delete('/entry/:eId',authController.authorization ,expensesController.deleteExpense);
router.get('/download',authController.authorization, premiumController.getPDFLink)

module.exports = router;
