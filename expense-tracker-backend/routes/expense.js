const express = require('express');
const Expense = require('../models/Expense');
const router = express.Router();
const { verifyToken } = require('../middleware/auth'); // Middleware to verify JWT

// Add a new expense
router.post('/', verifyToken, async (req, res) => {
  try {
    const expense = new Expense({
      user: req.user.id,
      ...req.body,
      activity: 'ADD_EXPENSE'
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense' });
  }
});

// Get all expenses for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// Delete an expense
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
});

// Add budget update route
router.post('/budget', verifyToken, async (req, res) => {
  // ... budget update logic
});

// Add activity history route
router.get('/activity', verifyToken, async (req, res) => {
  try {
    const activities = await Expense.find({ user: req.user.id })
      .sort({ timestamp: -1 });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

module.exports = router;