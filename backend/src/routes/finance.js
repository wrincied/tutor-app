const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Lesson = require('../models/lesson');
const Expense = require('../models/expense');

// @route   GET api/finance/summary
// @desc    Get financial summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const lessons = await Lesson.find({ tutor: req.user.id, status: 'completed' });
    const expenses = await Expense.find({ tutor: req.user.id });

    let totalIncome = 0;
    lessons.forEach(lesson => {
      totalIncome += lesson.lesson_price;
    });

    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      netProfit,
      lessonCount: lessons.length,
      expenseCount: expenses.length
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
