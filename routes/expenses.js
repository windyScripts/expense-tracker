const express = require('express');
const router = express.Router();

const userController = require('../controllers/user-controller')
const expensesController = require('../controllers/expenses-controller');
const premiumController = require('../controllers/downloads-controller')

router.get('/entries', userController.authorization ,expensesController.getButtonsAndLastPage);
router.post('/entry', userController.authorization ,expensesController.addExpense);
router.delete('/entry/:eId',userController.authorization ,expensesController.deleteExpense);
router.get('/download',userController.authorization, premiumController.getPDFLink)
router.get('/entries/:pageNumber', userController.authorization, expensesController.getPageOfExpenses)

router.patch('/entry/:eId', userController.authorization , expensesController.patchExpense);

module.exports = router;
