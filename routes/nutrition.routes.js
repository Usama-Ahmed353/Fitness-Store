const express = require('express');
const { verifyToken } = require('../middleware/auth');
const {
  getMyGoals,
  upsertMyGoals,
  getMyLogByDate,
  upsertMyLogByDate,
  getMySummary,
} = require('../controllers/nutrition.controller');

const router = express.Router();

// Backward-compatible aliases for legacy clients.
router.get('/goals', verifyToken, getMyGoals);
router.put('/goals', verifyToken, upsertMyGoals);
router.get('/logs/:date', verifyToken, getMyLogByDate);
router.put('/logs/:date', verifyToken, upsertMyLogByDate);
router.post('/log', verifyToken, (req, res, next) => {
  req.params.date = req.body?.date || new Date().toISOString().slice(0, 10);
  return upsertMyLogByDate(req, res, next);
});

router.get('/me/goals', verifyToken, getMyGoals);
router.put('/me/goals', verifyToken, upsertMyGoals);
router.get('/me/logs/:date', verifyToken, getMyLogByDate);
router.put('/me/logs/:date', verifyToken, upsertMyLogByDate);
router.get('/me/summary', verifyToken, getMySummary);

module.exports = router;
