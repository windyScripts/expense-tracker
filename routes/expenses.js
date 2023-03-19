const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller')
const expensesController = require('../controllers/expenses-controller');

router.get('/entries', authController.authorization ,expensesController.getExpenses);
router.post('/entry', authController.authorization ,expensesController.addExpense);
router.delete('/entry/:eId',authController.authorization ,expensesController.deleteExpense);

module.exports = router;
