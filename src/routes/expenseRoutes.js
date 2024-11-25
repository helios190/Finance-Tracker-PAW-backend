const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.post('/:userId', expenseController.addExpense);
router.get('/:userId', expenseController.getAllExpenses);
router.put('/:userId/:id', expenseController.updateExpense);
router.get('/:userId/summary/:year', expenseController.getMonthlyExpenseSummary);
router.delete('/:userId/:id', expenseController.deleteExpense);
router.get('/:userId/range', expenseController.getExpensesByDateRange);
router.get('/:userId/weekly-expense/:year/:month', expenseController.getWeeklyExpense);
router.get('/:userId/daily-expense/:year/:month', expenseController.getDailyExpense);

module.exports = router;
