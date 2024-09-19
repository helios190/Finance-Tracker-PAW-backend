const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'Other',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Income', IncomeSchema);
