const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  budget: {
    type: Number,
    required: true,
    default: 2000
  },
  activity: {
    type: String,
    required: true,
    enum: ['ADD_EXPENSE', 'DELETE_EXPENSE', 'UPDATE_BUDGET']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Expense', expenseSchema);