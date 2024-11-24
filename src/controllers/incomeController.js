const Income = require('../models/income');
const User = require('../models/profile');

// Add a new income
exports.addIncome = async (req, res) => {
  try {
    const { source, amount, category } = req.body;
    const newIncome = new Income({ source, amount, category });
    const income = await newIncome.save();
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getBalanceWithIncome = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const totalIncome = await Income.aggregate([
      { $match: { userId: user._id } }, 
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } } 
    ]);
    const totalIncomeAmount = totalIncome.length > 0 ? totalIncome[0].totalAmount : 0;
    res.json({
      userId: user._id,
      balance: user.balance,
      totalIncome: totalIncomeAmount
    });
  } catch (error) {
    console.error('Error getting balance and income:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all income entries
exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find();
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
        res.status(500).json({ message: 'Server error', error: error.message });
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
                { $eq: [{ $year: '$date' }, Number(year)] },  // Extract the year from date field
                { $eq: [{ $month: '$date' }, Number(month)] }  // Extract the month from date field
              ]
            }
          }
        },
        {
          $group: {
            _id: null,  // We don't need to group by anything specific
            totalIncome: { $sum: '$amount' }  // Sum all the amounts in this time range
          }
        }
      ]);
  
      res.json(income[0] || { totalIncome: 0 });  // Return the result or 0 if no data
    } catch (error) {
      console.error('Error getting monthly income summary:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

// exports.getIncomeByDateRange = async (req, res) => {
//     const { startDate, endDate } = req.query;
//     try {
//       const income = await Income.find({
//         date: { $gte: new Date(startDate), $lte: new Date(endDate) },
//       });
//       res.json(income);
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
//   };
  
exports.getIncomeByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;
  console.log('Received startDate:', startDate);
  console.log('Received endDate:', endDate);

  // Validate date formats
  if (!startDate || isNaN(Date.parse(startDate)) || !endDate || isNaN(Date.parse(endDate))) {
      return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
  }

  try {
      const income = await Income.aggregate([
          {
              $match: {
                  date: { $gte: new Date(startDate), $lte: new Date(endDate) },
              }
          },
          {
              $group: {
                  _id: "$category",
                  totalAmount: { $sum: "$amount" },
                  count: { $sum: 1 }
              }
          },
          {
              $sort: { totalAmount: -1 } // Sort by total amount in descending order
          }
      ]);

      // Log the result to see if any data was fetched
      console.log('Income Data:', income);

      res.json(income);
  } catch (error) {
      console.error('Error:', error.message); // Log the error
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getWeeklyIncomes = async (req, res) => {
  const { year } = req.params;
  try {
    const incomes = await Income.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: '$date' }, Number(year)] },
        },
      },
      {
        $group: {
          _id: { week: { $isoWeek: '$date' } },
          totalIncome: { $sum: '$amount' },
          incomes: { $push: { source: '$source', amount: '$amount', date: '$date', category: '$category' } }
        },
      },
      {
        $sort: { '_id.week': 1 },
      },
    ]);
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
