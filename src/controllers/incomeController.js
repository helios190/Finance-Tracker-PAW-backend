const Income = require('../models/income');
const User = require('../models/user');
const mongoose = require('mongoose');

// Add a new income for a specific user
exports.addIncome = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from params
    const { source, amount, category } = req.body;
    

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newIncome = new Income({ source, amount, category, userId });
    const income = await newIncome.save();

    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get balance and total income for a specific user
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

// Get all income entries for a specific user
exports.getAllIncome = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from params
    const income = await Income.find({ userId });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete income for a specific user
exports.deleteIncome = async (req, res) => {
  try {
    const { userId, id } = req.params; // Get userId and income entry ID from params
    const income = await Income.findOneAndDelete({ _id: id, userId });
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update income entry for a specific user
exports.updateIncome = async (req, res) => {
  try {
    const { userId, id } = req.params; // Get userId and income entry ID from params
    const { source, amount, category } = req.body;

    let income = await Income.findOne({ _id: id, userId });
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

// Get monthly income summary with percentage surge for each month for a specific user
exports.getMonthlyIncomeSummary = async (req, res) => {
  const { userId, year } = req.params; // Get userId and year from params

  try {
    const income = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Filter income by userId
          $expr: { $eq: [{ $year: "$date" }, Number(year)] } // Match records by year
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" } }, // Group by month
          totalIncome: { $sum: "$amount" }, // Sum income for each month
          incomeDetails: { $push: { source: "$source", amount: "$amount", date: "$date", category: "$category" } } // Detailed income records for each month
        }
      },
      {
        $sort: { "_id.month": 1 } // Sort by month in ascending order
      }
    ]);

    // Calculate the percentage surge in income between each month
    for (let i = 1; i < income.length; i++) {
      const previousMonthIncome = income[i - 1].totalIncome;
      const currentMonthIncome = income[i].totalIncome;
      const surgePercentage = ((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;
      income[i].surgePercentage = surgePercentage.toFixed(2); // Store the surge percentage
    }

    res.json(income.length > 0 ? income : [{ totalIncome: 0 }]);
  } catch (error) {
    console.error('Error getting monthly income summary:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




// Get income by date range for a specific user
exports.getIncomeByDateRange = async (req, res) => {
  const { userId } = req.params;  // Get userId from params
  const { startDate, endDate } = req.query;

  // Validate date formats
  if (!startDate || isNaN(Date.parse(startDate)) || !endDate || isNaN(Date.parse(endDate))) {
    return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD format.' });
  }

  try {
    const incomeSummary = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Ensure userId is an ObjectId
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        // Group by source (or category, or any other field you prefer)
        $group: {
          _id: "$source",  // Group by source (or category, etc.)
          totalAmount: { $sum: "$amount" },  // Total income for each source/category
          count: { $sum: 1 },  // Count the number of records for each source/category
          averageAmount: { $avg: "$amount" },  // Calculate average income for each source/category
          incomeDetails: { $push: { amount: "$amount", date: "$date" } }  // Push all income records for each group
        }
      },
      {
        // Sort by total income in descending order
        $sort: { totalAmount: -1 }
      }
    ]);

    res.json(incomeSummary);  // Return the detailed income summary
  } catch (error) {
    console.error('Error getting income summary:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWeeklyIncome = async (req, res) => {
  const { userId, year, month } = req.params;  // Get userId, year, and month from params
  const startOfMonth = new Date(year, month - 1, 1); 
  const endOfMonth = new Date(year, month, 0); 

  try {
    // Define the weekly boundaries (week ranges for the month)
    const weekBoundaries = [
      { start: new Date(year, month - 1, 1), end: new Date(year, month - 1, 7) },
      { start: new Date(year, month - 1, 8), end: new Date(year, month - 1, 14) },
      { start: new Date(year, month - 1, 15), end: new Date(year, month - 1, 21) },
      { start: new Date(year, month - 1, 22), end: endOfMonth }
    ];

    let weeklyResult = weekBoundaries.map((week, index) => ({
      week: index + 1,
      totalIncome: 0,
      incomes: [],
      surgePercentage: 0  // Initialize the surgePercentage field
    }));

    // Get income records for the specific user and month
    const incomes = await Income.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Group incomes by week
    incomes.forEach(income => {
      weekBoundaries.forEach((week, index) => {
        if (income.date >= week.start && income.date <= week.end) {
          weeklyResult[index].totalIncome += income.amount;
          weeklyResult[index].incomes.push({
            source: income.source,
            amount: income.amount,
            date: income.date,
            category: income.category,
          });
        }
      });
    });

    // Calculate the surge percentage for each week
    for (let i = 1; i < weeklyResult.length; i++) {
      const previousWeekIncome = weeklyResult[i - 1].totalIncome;
      const currentWeekIncome = weeklyResult[i].totalIncome;

      // Ensure previousWeekIncome is not 0 to avoid division by zero
      if (previousWeekIncome !== 0) {
        const surgePercentage = ((currentWeekIncome - previousWeekIncome) / previousWeekIncome) * 100;
        weeklyResult[i].surgePercentage = surgePercentage.toFixed(2);  // Round to 2 decimal places
      }
    }

    res.json(weeklyResult);  // Return the weekly income result including surge percentages
  } catch (error) {
    console.error('Error getting weekly income summary:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Daily Income Summary for a specific user
exports.getDailyIncome = async (req, res) => {
  const { userId, year, month } = req.params;  // Get userId, year, and month from params
  const startOfMonth = new Date(year, month - 1, 1); 
  const endOfMonth = new Date(year, month, 0); 

  try {
    const dailyIncome = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Filter by userId
          date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter by date range (start and end of the month)
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" }, month: { $month: "$date" }, year: { $year: "$date" } }, // Group by day
          totalIncome: { $sum: "$amount" },  // Sum of income amounts for each day
          incomeDetails: { $push: { source: "$source", amount: "$amount", date: "$date", category: "$category" } } // Push all income details for each day
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day
      }
    ]);

    res.json(dailyIncome);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
