const NutritionLog = require('../models/NutritionLog');
const NutritionGoal = require('../models/NutritionGoal');

const normalizeDate = (value) => {
  const d = value ? new Date(value) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const computeTotals = (meals = {}) => {
  const sections = ['breakfast', 'lunch', 'dinner', 'snacks'];
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  sections.forEach((section) => {
    (meals[section] || []).forEach((item) => {
      totals.calories += Number(item.calories || 0);
      totals.protein += Number(item.protein || 0);
      totals.carbs += Number(item.carbs || 0);
      totals.fat += Number(item.fat || 0);
    });
  });

  return totals;
};

exports.getMyGoals = async (req, res) => {
  try {
    let goals = await NutritionGoal.findOne({ userId: req.user.id });
    if (!goals) {
      goals = await NutritionGoal.create({ userId: req.user.id });
    }
    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.upsertMyGoals = async (req, res) => {
  try {
    const goals = await NutritionGoal.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyLogByDate = async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);

    let log = await NutritionLog.findOne({ userId: req.user.id, date });
    if (!log) {
      log = await NutritionLog.create({
        userId: req.user.id,
        date,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      });
    }

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.upsertMyLogByDate = async (req, res) => {
  try {
    const date = normalizeDate(req.params.date);
    const meals = req.body.meals || { breakfast: [], lunch: [], dinner: [], snacks: [] };
    const totals = computeTotals(meals);

    const log = await NutritionLog.findOneAndUpdate(
      { userId: req.user.id, date },
      { meals, totals },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySummary = async (req, res) => {
  try {
    const days = Math.max(1, Math.min(90, Number(req.query.days || 7)));
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - (days - 1));

    const logs = await NutritionLog.find({ userId: req.user.id, date: { $gte: from } })
      .sort({ date: 1 })
      .lean();

    const totals = logs.reduce(
      (acc, l) => {
        acc.calories += Number(l.totals?.calories || 0);
        acc.protein += Number(l.totals?.protein || 0);
        acc.carbs += Number(l.totals?.carbs || 0);
        acc.fat += Number(l.totals?.fat || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const avg = {
      calories: logs.length ? Math.round(totals.calories / logs.length) : 0,
      protein: logs.length ? Math.round(totals.protein / logs.length) : 0,
      carbs: logs.length ? Math.round(totals.carbs / logs.length) : 0,
      fat: logs.length ? Math.round(totals.fat / logs.length) : 0,
    };

    res.status(200).json({
      success: true,
      data: {
        rangeDays: days,
        count: logs.length,
        totals,
        averages: avg,
        series: logs.map((l) => ({
          date: l.date,
          calories: l.totals?.calories || 0,
          protein: l.totals?.protein || 0,
          carbs: l.totals?.carbs || 0,
          fat: l.totals?.fat || 0,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
