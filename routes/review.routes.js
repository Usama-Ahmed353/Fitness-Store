const express = require('express');
const { body, query, param } = require('express-validator');
const {
  createReview,
  getReviews,
  markReviewHelpful,
  deleteReview,
} = require('../controllers/review.controller');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get(
  '/',
  query('targetType').notEmpty().withMessage('Target type is required'),
  query('targetId').notEmpty().withMessage('Target ID is required'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  getReviews
);

// Protected routes
router.post(
  '/',
  verifyToken,
  body('targetType').isIn(['gym', 'trainer', 'class']).withMessage('Invalid target type'),
  body('targetId').notEmpty().withMessage('Target ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('title').trim().notEmpty().isLength({ min: 5 }).withMessage('Title is required'),
  body('body').trim().notEmpty().isLength({ min: 10 }).withMessage('Review body is required'),
  createReview
);

router.patch(
  '/:id/helpful',
  verifyToken,
  param('id').isMongoId(),
  markReviewHelpful
);

router.delete(
  '/:id',
  verifyToken,
  param('id').isMongoId(),
  deleteReview
);

module.exports = router;
