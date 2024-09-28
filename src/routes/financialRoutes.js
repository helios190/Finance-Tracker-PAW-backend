const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');

router.get('/:year/:month', financialController.getFourWeekIncomeAndExpense);

module.exports = router;