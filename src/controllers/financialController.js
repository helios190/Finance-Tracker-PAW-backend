const Expense = require('../models/expense');
const Income = require('../models/income');
const User = require("../models/user")


// exports.getFourWeekIncomeAndExpense = async (req, res) => {
//   const { userId, year, month } = req.params;  // Get userId, year, and month from params

//   const startOfMonth = new Date(year, month - 1, 1); 
//   const endOfMonth = new Date(year, month, 0); 

//   try {
//     const user = await User.findById(userId);  // Ensure user exists
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const weekBoundaries = [
//       { start: new Date(year, month - 1, 1), end: new Date(year, month - 1, 7) },
//       { start: new Date(year, month - 1, 8), end: new Date(year, month - 1, 14) },
//       { start: new Date(year, month - 1, 15), end: new Date(year, month - 1, 21) },
//       { start: new Date(year, month - 1, 22), end: endOfMonth }
//     ];

//     let weeklyResult = weekBoundaries.map((week, index) => ({
//       week: index + 1,
//       totalExpenses: 0,
//       expenses: [],
//       totalIncome: 0,
//       incomes: []
//     }));

//     // Fetch expenses for the user within the specified date range
//     const expenses = await Expense.find({
//       userId: user._id,  // Filter by userId
//       date: { $gte: startOfMonth, $lte: endOfMonth },
//     });

//     // Fetch incomes for the user within the specified date range
//     const incomes = await Income.find({
//       userId: user._id,  // Filter by userId
//       date: { $gte: startOfMonth, $lte: endOfMonth },
//     });

//     // Organize expenses by week
//     expenses.forEach(expense => {
//       weekBoundaries.forEach((week, index) => {
//         if (expense.date >= week.start && expense.date <= week.end) {
//           weeklyResult[index].totalExpenses += expense.amount;
//           weeklyResult[index].expenses.push({
//             description: expense.description,
//             amount: expense.amount,
//             date: expense.date,
//             category: expense.category,
//           });
//         }
//       });
//     });

//     // Organize incomes by week
//     incomes.forEach(income => {
//       weekBoundaries.forEach((week, index) => {
//         if (income.date >= week.start && income.date <= week.end) {
//           weeklyResult[index].totalIncome += income.amount;
//           weeklyResult[index].incomes.push({
//             source: income.source,
//             amount: income.amount,
//             date: income.date,
//             category: income.category,
//           });
//         }
//       });
//     });

//     // Return the detailed weekly income and expense summary
//     res.json(weeklyResult);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

exports.recalculateBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);  // Find user by userId
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Calculate total income for the user
    const totalIncome = await Income.aggregate([
      { $match: { userId: user._id } },  // Match userId
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);

    const incomeTotal = totalIncome.length > 0 ? totalIncome[0].totalAmount : 0;

    // Step 3: Calculate total expense for the user
    const totalExpense = await Expense.aggregate([
      { $match: { userId: user._id } },  // Match userId
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);

    const expenseTotal = totalExpense.length > 0 ? totalExpense[0].totalAmount : 0;

    // Step 4: Recalculate user's balance
    user.balance = incomeTotal - expenseTotal;
    await user.save();

    // Step 5: Respond with the updated balance
    res.json({
      message: 'Balance recalculated successfully',
      updatedBalance: user.balance,
      totalIncome: incomeTotal,
      totalExpense: expenseTotal,
    });
  } catch (error) {
    console.error('Error recalculating balance:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get balance progress as percentage of target
exports.getBalanceProgress = async (req, res) => {
  const { userId } = req.params; // User ID from params

  try {
    // Step 1: Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Get the user's balance and target
    const balance = user.balance;
    const target = user.target;

    if (target === 0) {
      return res.status(400).json({ message: 'Target cannot be zero' });
    }

    // Step 3: Calculate progress as percentage of target
    const progressPercentage = (balance / target) * 100;

    // Step 4: Return the progress percentage
    res.json({
      message: 'Balance progress calculated successfully',
      progressPercentage: progressPercentage.toFixed(2),  // Rounded to two decimal places
      balance: balance,
      target: target
    });
  } catch (error) {
    console.error('Error calculating balance progress:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};