const express = require('express');
const router = express.Router();

// Import webhook handler
const webhookHandler = require('../controllers/webhook.controller');

/**
 * Stripe webhook endpoint
 * POST /api/webhooks/stripe
 * 
 * Important: This route requires raw body for signature verification
 * Express middleware should NOT parse JSON before this handler
 */
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookHandler.handleStripeWebhook
);

module.exports = router;
