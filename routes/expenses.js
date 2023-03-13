const express = require('express');
const router = express.Router();

const controller = require('../controllers/expenses-controller');

router.get('/entries',controller.getExpenses);
router.post('/entry',controller.addExpense);
router.delete('/entry/:eId',controller.deleteExpense);

module.exports = router;