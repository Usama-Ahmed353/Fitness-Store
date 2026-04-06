const express = require('express');
const { body, query } = require('express-validator');
const {
  joinGym,
  getMyMembership,
  freezeMembership,
  cancelMembership,
  checkInToGym,
  getMyCheckIns,
  getMyBookings,
  getAllMembers,
} = require('../controllers/member.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Public routes
router.post(
  '/join',
  verifyToken,
  body('gymId').notEmpty().withMessage('Gym ID is required'),
  body('plan').isIn(['base', 'peak', 'peak_results', 'peak_plus']).withMessage('Invalid plan'),
  body('paymentMethodId').notEmpty().withMessage('Payment method is required'),
  joinGym
);

// Protected routes
router.get('/me', verifyToken, getMyMembership);

router.patch('/me/freeze', verifyToken, freezeMembership);

router.patch('/me/cancel', verifyToken, cancelMembership);

router.post(
  '/checkin',
  verifyToken,
  body('gymId').notEmpty().withMessage('Gym ID is required'),
  checkInToGym
);

router.get('/me/checkins', verifyToken, getMyCheckIns);

router.get('/me/bookings', verifyToken, getMyBookings);

// Admin routes
router.get(
  '/',
  verifyToken,
  authorize('admin', 'super_admin'),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  getAllMembers
);

module.exports = router;
