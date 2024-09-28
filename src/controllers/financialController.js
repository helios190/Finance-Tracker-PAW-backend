const Expense = require('../models/expense');
const Income = require('../models/income');

// Get 4-week segmented income and expenses for a specific month
exports.getFourWeekIncomeAndExpense = async (req, res) => {
  const { year, month } = req.params; // `year` and `month` provided as URL parameters
  const startOfMonth = new Date(year, month - 1, 1); // First day of the month
  const endOfMonth = new Date(year, month, 0); // Last day of the month

  try {
    // Define the 4 weeks within the month
    const weekBoundaries = [
      { start: new Date(year, month - 1, 1), end: new Date(year, month - 1, 7) },
      { start: new Date(year, month - 1, 8), end: new Date(year, month - 1, 14) },
      { start: new Date(year, month - 1, 15), end: new Date(year, month - 1, 21) },
      { start: new Date(year, month - 1, 22), end: endOfMonth }
    ];

    // Initialize empty results for each week
    let weeklyResult = weekBoundaries.map((week, index) => ({
      week: index + 1,
      totalExpenses: 0,
      expenses: [],
      totalIncome: 0,
      incomes: []
    }));

    // Fetch expenses within the month
    const expenses = await Expense.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Fetch incomes within the month
    const incomes = await Income.find({
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Segregate expenses and incomes into the 4 weeks based on date range
    expenses.forEach(expense => {
      weekBoundaries.forEach((week, index) => {
        if (expense.date >= week.start && expense.date <= week.end) {
          weeklyResult[index].totalExpenses += expense.amount;
          weeklyResult[index].expenses.push({
            description: expense.description,
            amount: expense.amount,
            date: expense.date,
            category: expense.category,
          });
        }
      });
    });

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

    res.json(weeklyResult);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
