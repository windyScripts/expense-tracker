const express = require('express');
const router = express.Router();

const expensesController = require('../controllers/expenses-controller');
const premiumController = require('../controllers/downloads-controller');
const auth = require('../middleware/auth');

router.get('/entries', auth.authorization ,expensesController.getButtonsAndLastPage);
router.post('/entry', auth.authorization ,expensesController.addExpense);
router.delete('/entry/:eId',auth.authorization ,expensesController.deleteExpense);
router.get('/download',auth.authorization, premiumController.getPDFLink);
router.get('/entries/:pageNumber', auth.authorization, expensesController.getPageOfExpenses);
router.patch('/entry/:eId', auth.authorization , expensesController.patchExpense);

module.exports = router;
