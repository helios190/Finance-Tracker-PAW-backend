const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/', expenseController.addExpense);
router.get('/', expenseController.getAllExpenses);
router.put('/:id', expenseController.updateExpense);
router.get('/summary/:year/:month', expenseController.getMonthlyExpenseSummary);
router.delete('/:id', expenseController.deleteExpense);
router.get('/daterange', expenseController.getExpensesByDateRange);

module.exports = router;
