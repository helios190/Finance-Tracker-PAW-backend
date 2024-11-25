const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');


router.get('/:userId/recalculate-balance', financialController.recalculateBalance);
router.get('/:userId/balance-progress', financialController.getBalanceProgress);


module.exports = router;