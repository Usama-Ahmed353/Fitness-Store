const express = require('express');
const { body, query, param } = require('express-validator');
const {
  getClasses,
  getClass,
  createClass,
  bookClass,
  cancelClassBooking,
  classCheckIn,
  updateClass,
  cancelClass,
} = require('../controllers/class.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('gymId').optional(),
  query('category').optional(),
  getClasses
);

router.get('/:id', param('id').isMongoId(), getClass);

// Protected routes
router.post(
  '/',
  verifyToken,
  authorize('gym_owner', 'trainer'),
  body('gymId').notEmpty().withMessage('Gym ID is required'),
  body('name').trim().notEmpty().withMessage('Class name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('maxCapacity').isInt({ min: 1 }).withMessage('Max capacity is required'),
  createClass
);

router.post(
  '/:id/book',
  verifyToken,
  param('id').isMongoId(),
  bookClass
);

router.delete(
  '/:id/cancel-booking',
  verifyToken,
  param('id').isMongoId(),
  cancelClassBooking
);

router.post(
  '/:id/check-in',
  verifyToken,
  param('id').isMongoId(),
  classCheckIn
);

router.patch(
  '/:id',
  verifyToken,
  authorize('gym_owner'),
  param('id').isMongoId(),
  updateClass
);

router.post(
  '/:id/cancel',
  verifyToken,
  authorize('gym_owner'),
  param('id').isMongoId(),
  body('reason').optional().trim(),
  cancelClass
);

module.exports = router;
