const express = require('express');
const { body, query, param } = require('express-validator');
const {
  getTrainers,
  getTrainer,
  getTrainerAvailability,
  bookTrainerSession,
  createTrainer,
  updateTrainer,
  getTrainerSessions,
  getMyTrainerSessions,
  getAdminTrainerSessions,
} = require('../controllers/trainer.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('gymId').optional(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  getTrainers
);

router.get(
  '/sessions/my',
  verifyToken,
  query('status').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  getMyTrainerSessions
);

router.get(
  '/admin/sessions',
  verifyToken,
  authorize('admin', 'super_admin'),
  query('status').optional(),
  query('trainerId').optional().isMongoId(),
  query('gymId').optional().isMongoId(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  getAdminTrainerSessions
);

router.get('/:id', param('id').isMongoId(), getTrainer);

router.get(
  '/:id/availability',
  param('id').isMongoId(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  getTrainerAvailability
);

// Protected routes
router.post(
  '/:id/book-session',
  verifyToken,
  param('id').isMongoId(),
  body('scheduledDate').notEmpty().isISO8601().withMessage('Valid date is required'),
  body('duration').optional().isInt({ min: 15, max: 240 }),
  bookTrainerSession
);

router.post(
  '/',
  verifyToken,
  authorize('gym_owner'),
  body('gymId').notEmpty().withMessage('Gym ID is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('firstName').optional().isString(),
  body('lastName').optional().isString(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('hourlyRate').optional().isFloat({ min: 0 }),
  createTrainer
);

router.patch(
  '/:id',
  verifyToken,
  param('id').isMongoId(),
  updateTrainer
);

router.get(
  '/:id/sessions',
  verifyToken,
  param('id').isMongoId(),
  query('status').optional(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  getTrainerSessions
);

module.exports = router;
