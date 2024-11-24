const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');

router.get('/:year/:month', financialController.getFourWeekIncomeAndExpense);
router.get('/:userId/recalculate-balance', financialController.recalculateBalance);
router.get('/users/:userId/balance-progress', financialController.getBalanceProgress);


module.exports = router;