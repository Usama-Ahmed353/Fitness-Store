const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { verifyToken } = require('../middleware/auth');

// Chat is available to all, but logged-in users get personalized responses
router.post('/', optionalAuth, chatController.chat);

// Optional auth middleware - doesn't fail if no token, just attaches user if present
function optionalAuth(req, res, next) {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(' ')[1];
  if (!token) return next();

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
    // Token invalid — continue as guest
  }
  next();
}

module.exports = router;
