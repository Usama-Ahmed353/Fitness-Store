const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const paymentController = require('../controllers/payment.controller');

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

/**
 * Create one-time payment intent
 * POST /api/payments/create-intent
 */
router.post(
  '/create-intent',
  [
    body('amount')
      .isFloat({ min: 0.01 })
      .withMessage('Amount must be a positive number'),
    body('currency')
      .optional()
      .isLength({ min: 3, max: 3 })
      .withMessage('Currency must be a 3-letter code'),
    body('type')
      .isIn(['class_pack', 'day_pass', 'merchandise', 'other'])
      .withMessage('Invalid payment type'),
    body('description')
      .optional()
      .isLength({ min: 1, max: 500 })
      .withMessage('Description must be between 1 and 500 characters'),
  ],
  paymentController.createPaymentIntent
);

/**
 * Create recurring subscription
 * POST /api/payments/create-subscription
 */
router.post(
  '/create-subscription',
  [
    body('priceId')
      .notEmpty()
      .withMessage('Price ID is required')
      .matches(/^price_/)
      .withMessage('Invalid Stripe price ID'),
    body('paymentMethodId')
      .notEmpty()
      .withMessage('Payment method ID is required')
      .matches(/^pm_/)
      .withMessage('Invalid Stripe payment method ID'),
  ],
  paymentController.createSubscription
);

/**
 * Cancel subscription
 * POST /api/payments/cancel-subscription
 */
router.post(
  '/cancel-subscription',
  [
    body('subscriptionId')
      .notEmpty()
      .withMessage('Subscription ID is required')
      .matches(/^sub_/)
      .withMessage('Invalid Stripe subscription ID'),
    body('immediately')
      .optional()
      .isBoolean()
      .withMessage('Immediately must be a boolean'),
  ],
  paymentController.cancelSubscription
);

/**
 * Get payment history
 * GET /api/payments/history
 */
router.get(
  '/history',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  paymentController.getPaymentHistory
);

/**
 * Get payment details
 * GET /api/payments/:id
 */
router.get('/:id', paymentController.getPaymentDetails);

/**
 * Create setup intent for saving payment method
 * POST /api/payments/setup-intent
 */
router.post('/setup-intent', paymentController.createSetupIntent);

/**
 * Confirm payment (after client processing)
 * POST /api/payments/confirm
 */
router.post(
  '/confirm',
  [
    body('intentId')
      .notEmpty()
      .withMessage('Intent ID is required')
      .matches(/^pi_/)
      .withMessage('Invalid payment intent ID'),
    body('paymentMethodId')
      .notEmpty()
      .withMessage('Payment method ID is required')
      .matches(/^pm_/)
      .withMessage('Invalid payment method ID'),
  ],
  paymentController.confirmPayment
);

/**
 * Create billing portal session
 * POST /api/payments/portal
 */
router.post(
  '/portal',
  [
    body('returnUrl')
      .optional()
      .isURL()
      .withMessage('Return URL must be a valid URL'),
  ],
  paymentController.createPortalSession
);

module.exports = router;
