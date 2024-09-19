const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

router.post('/', incomeController.addIncome);
router.get('/', incomeController.getAllIncome);
router.put('/:id', incomeController.updateIncome);
router.get('/summary/:year/:month', incomeController.getMonthlyIncomeSummary);
router.get('/daterange', incomeController.getIncomeByDateRange);
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
