const Expense = require('../models/expense');
const User = require('../models/user');
const mongoose = require('mongoose');



exports.addExpense = async (req, res) => {
  const { userId } = req.params;  // Get userId from params
  const { source, amount, category } = req.body;

  try {
    // Ensure the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newExpense = new Expense({
      source,
      amount,
      category,
      userId: user._id  // Associate expense with userId
    });

    const expense = await newExpense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all expenses for a specific user
exports.getAllExpenses = async (req, res) => {
  const { userId } = req.params;  // Get userId from params

  try {
    const expenses = await Expense.find({ userId: userId });  // Filter by userId
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete expense for a specific user
exports.deleteExpense = async (req, res) => {
  const { userId, id } = req.params;  // Get userId and expense ID from params

  try {
    const expense = await Expense.findOneAndDelete({ _id: id, userId: userId });  // Filter by userId
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update expense for a specific user
exports.updateExpense = async (req, res) => {
  const { userId, id } = req.params;  // Get userId and expense ID from params
  const { description, amount, category } = req.body;

  try {
    let expense = await Expense.findOne({ _id: id, userId: userId });  // Filter by userId
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    expense.description = description;
    expense.amount = amount;
    expense.category = category;
    expense = await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get monthly expense summary with percentage change for each month for a specific user
exports.getMonthlyExpenseSummary = async (req, res) => {
  const { userId, year } = req.params; // Get userId and year from params

  try {
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Filter expenses by userId
          $expr: { $eq: [{ $year: "$date" }, Number(year)] } // Match records by year
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },  // Group by month
          totalExpenses: { $sum: "$amount" },  // Sum of expenses per month
          count: { $sum: 1 },  // Count of records per month
          averageAmount: { $avg: "$amount" },  // Calculate average per month
          expenseDetails: { $push: { description: "$description", amount: "$amount", date: "$date", category: "$category" } } // Push expense details for each month
        }
      },
      {
        $sort: { "_id.month": 1 }  // Sort by month in ascending order
      }
    ]);

    // Calculate percentage difference between each month and the previous month
    for (let i = 1; i < expenses.length; i++) {
      const previousMonthExpense = expenses[i - 1].totalExpenses;
      const currentMonthExpense = expenses[i].totalExpenses;
      const percentageChange = ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;
      expenses[i].percentageChange = percentageChange.toFixed(2);  // Add the percentage change field
    }

    res.json(expenses.length > 0 ? expenses : [{ totalExpenses: 0 }]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get expenses by date range for a specific user
exports.getExpensesByDateRange = async (req, res) => {
  const { userId } = req.params;  // Get userId from params
  const { startDate, endDate } = req.query;

  try {
    const expenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),  // Filter by userId
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$category",  // Group by category (can be other fields like source, etc.)
          totalAmount: { $sum: "$amount" },  // Total amount for each category
          count: { $sum: 1 },  // Count records for each category
          averageAmount: { $avg: "$amount" },  // Average amount for each category
          expenseDetails: { $push: { description: "$description", amount: "$amount", date: "$date", category: "$category" } }  // Push detailed data
        }
      },
      {
        $sort: { totalAmount: -1 }  // Sort by total amount in descending order
      }
    ]);

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Weekly Expense Summary for a specific user with surge percentage
exports.getWeeklyExpense = async (req, res) => {
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
      totalExpense: 0,
      expenses: [],
      surgePercentage: 0  // Initialize the surge percentage field
    }));

    // Get expense records for the specific user and month
    const expenses = await Expense.find({
      userId: new mongoose.Types.ObjectId(userId),
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Group expenses by week
    expenses.forEach(expense => {
      weekBoundaries.forEach((week, index) => {
        if (expense.date >= week.start && expense.date <= week.end) {
          weeklyResult[index].totalExpense += expense.amount;
          weeklyResult[index].expenses.push({
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category,
          });
        }
      });
    });

    // Calculate the surge percentage for each week
    for (let i = 1; i < weeklyResult.length; i++) {
      const previousWeekExpense = weeklyResult[i - 1].totalExpense;
      const currentWeekExpense = weeklyResult[i].totalExpense;

      // Ensure previousWeekExpense is not 0 to avoid division by zero
      if (previousWeekExpense !== 0) {
        const surgePercentage = ((currentWeekExpense - previousWeekExpense) / previousWeekExpense) * 100;
        weeklyResult[i].surgePercentage = surgePercentage.toFixed(2);  // Round to 2 decimal places
      }
    }

    res.json(weeklyResult);  // Return the weekly expense result including surge percentages
  } catch (error) {
    console.error('Error getting weekly expense summary:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Daily Expense Summary for a specific user
exports.getDailyExpense = async (req, res) => {
  const { userId, year, month } = req.params;  // Get userId, year, and month from params
  const startOfMonth = new Date(year, month - 1, 1); 
  const endOfMonth = new Date(year, month, 0); 

  try {
    const dailyExpense = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Filter by userId
          date: { $gte: startOfMonth, $lte: endOfMonth }, // Filter by date range (start and end of the month)
        }
      },
      {
        $group: {
          _id: { day: { $dayOfMonth: "$date" }, month: { $month: "$date" }, year: { $year: "$date" } }, // Group by day
          totalExpense: { $sum: "$amount" },  // Sum of expenses for each day
          expenseDetails: { $push: { description: "$description", amount: "$amount", date: "$date", category: "$category" } } // Push all expense details for each day
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } // Sort by year, month, and day
      }
    ]);

    res.json(dailyExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
