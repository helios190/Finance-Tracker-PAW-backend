const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

// Routes for income with user-specific focus
router.post('/:userId', incomeController.addIncome);  
router.get('/:userId/balance', incomeController.getBalanceWithIncome);  
router.get('/:userId', incomeController.getAllIncome);  
router.delete('/:userId/:id', incomeController.deleteIncome);  
router.put('/:userId/:id', incomeController.updateIncome);  
router.get('/:userId/summary/:year', incomeController.getMonthlyIncomeSummary);  
router.get('/:userId/range', incomeController.getIncomeByDateRange);  
router.get('/:userId/weekly-income/:year/:month', incomeController.getWeeklyIncome);
router.get('/:userId/daily-income/:year/:month', incomeController.getDailyIncome);

module.exports = router;
