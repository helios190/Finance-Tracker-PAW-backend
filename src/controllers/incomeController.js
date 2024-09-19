const Income = require('../models/income');

// Add a new income
exports.addIncome = async (req, res) => {
  try {
    const { source, amount, category } = req.body;
    const newIncome = new Income({ source, amount, category });
    const income = await newIncome.save();
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all income entries
exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find();
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update income entry
exports.updateIncome = async (req, res) => {
    const { source, amount, category } = req.body;
    try {
      let income = await Income.findById(req.params.id);
      if (!income) return res.status(404).json({ message: 'Income not found' });
  
      income.source = source;
      income.amount = amount;
      income.category = category;
      income = await income.save();
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getMonthlyIncomeSummary = async (req, res) => {
    const { year, month } = req.params;
    try {
      const income = await Income.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: '$date' }, Number(year)] },
                { $eq: [{ $month: '$date' }, Number(month)] },
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            totalIncome: { $sum: '$amount' },
          },
        },
      ]);
      res.json(income[0] || { totalIncome: 0 });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getIncomeByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const income = await Income.find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      res.json(income);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  