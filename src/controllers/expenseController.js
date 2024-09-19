// src/controllers/expenseController.js
const Expense = require('../models/expense');

// Add a new expense
exports.addExpense = async (req, res) => {
  try {
    const { description, amount, category } = req.body;
    const newExpense = new Expense({ description, amount, category });
    const expense = await newExpense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update expense entry
exports.updateExpense = async (req, res) => {
    const { description, amount, category } = req.body;
    try {
      let expense = await Expense.findById(req.params.id);
      if (!expense) return res.status(404).json({ message: 'Expense not found' });
  
      expense.description = description;
      expense.amount = amount;
      expense.category = category;
      expense = await expense.save();
      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getMonthlyExpenseSummary = async (req, res) => {
    const { year, month } = req.params;
    try {
      const expenses = await Expense.aggregate([
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
            totalExpenses: { $sum: '$amount' },
          },
        },
      ]);
      res.json(expenses[0] || { totalExpenses: 0 });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

exports.getExpensesByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
      const expenses = await Expense.find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  