import express from 'express';
import { protect } from '../middleware/auth.js';
import NutritionPlan from '../models/NutritionPlan.js';
import WeightLog from '../models/WeightLog.js';
import MacroLog from '../models/MacroLog.js';

const router = express.Router();

// @desc    Get user's active nutrition plan populated with stack details
// @route   GET /api/dashboard/plan
// @access  Private
router.get('/plan', protect, async (req, res) => {
  try {
    const plan = await NutritionPlan.findOne({ user: req.user._id }).populate('stack');
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's weight log history
// @route   GET /api/dashboard/weight
// @access  Private
router.get('/weight', protect, async (req, res) => {
  try {
    const logs = await WeightLog.find({ user: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new weight log entry
// @route   POST /api/dashboard/weight
// @access  Private
router.post('/weight', protect, async (req, res) => {
  const { weightKg, date } = req.body;

  if (!weightKg) {
    return res.status(400).json({ message: 'Weight value in kg is required' });
  }

  try {
    const newLog = new WeightLog({
      user: req.user._id,
      weightKg: Number(weightKg),
      date: date ? new Date(date) : new Date()
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user's daily macro logs
// @route   GET /api/dashboard/macros
// @access  Private
router.get('/macros', protect, async (req, res) => {
  try {
    const logs = await MacroLog.find({ user: req.user._id }).sort({ date: 1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a new macro log entry
// @route   POST /api/dashboard/macros
// @access  Private
router.post('/macros', protect, async (req, res) => {
  const { protein, carbs, fat, calories, date } = req.body;

  if (protein === undefined || carbs === undefined || fat === undefined || calories === undefined) {
    return res.status(400).json({ message: 'Protein, carbs, fat, and calories values are all required' });
  }

  try {
    const newLog = new MacroLog({
      user: req.user._id,
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      calories: Number(calories),
      date: date ? new Date(date) : new Date()
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
