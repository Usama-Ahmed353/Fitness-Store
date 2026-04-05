const express = require('express');
const jwt = require('jsonwebtoken');
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

function optionalAuth(req, res, next) {
  let token = req.headers.authorization;

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  if (!token) {
    token = req.cookies?.token;
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
  } catch {
    // Continue as guest if token is invalid.
  }

  return next();
}

router.post('/search', optionalAuth, aiController.searchProductsWithAI);
router.post('/recommend', optionalAuth, aiController.recommendProductsWithAI);
router.post('/order-status', verifyToken, aiController.getOrderStatusWithAI);
router.post('/cart-action', verifyToken, aiController.handleCartActionWithAI);
router.post('/faq', optionalAuth, aiController.answerFAQWithAI);

module.exports = router;
