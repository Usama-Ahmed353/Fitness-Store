const { validationResult } = require('express-validator');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Member = require('../models/Member');
const stripeService = require('../services/stripe.service');
const emailService = require('../services/email.service');

/**
 * Create a one-time payment intent
 * POST /api/payments/create-intent
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { amount, currency = 'usd', type, description } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get or create Stripe customer
    const customerId = await stripeService.getOrCreateCustomer(user);

    // Create payment intent
    const metadata = {
      userId: userId,
      type,
      description,
    };

    const intent = await stripeService.createPaymentIntent(
      Math.round(amount * 100), // Convert to cents
      currency,
      metadata
    );

    res.status(200).json({
      success: true,
      message: 'Payment intent created',
      data: {
        clientSecret: intent.client_secret,
        intentId: intent.id,
        amount: intent.amount,
        currency: intent.currency,
      },
    });
  } catch (error) {
    console.error('Create intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment intent',
    });
  }
};

/**
 * Create a recurring subscription
 * POST /api/payments/create-subscription
 */
exports.createSubscription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { priceId, paymentMethodId } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get or create Stripe customer
    const customerId = await stripeService.getOrCreateCustomer(user);

    // Create subscription
    const subscription = await stripeService.createSubscription(
      customerId,
      priceId,
      paymentMethodId
    );

    // Save to Payment model
    const payment = await Payment.create({
      userId,
      type: 'membership',
      amount: subscription.items.data[0].price.unit_amount / 100,
      currency: subscription.currency,
      status: 'pending', // Will update on webhook
      stripeIntentId: subscription.latest_invoice?.payment_intent?.id,
      stripeSubscriptionId: subscription.id,
      metadata: {
        priceId,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created',
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        nextBillingDate: new Date(subscription.current_period_end * 1000),
        paymentId: payment._id,
      },
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create subscription',
    });
  }
};

/**
 * Cancel a subscription
 * POST /api/payments/cancel-subscription
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { subscriptionId, immediately = false } = req.body;
    const userId = req.user.id;

    // Verify ownership
    const member = await Member.findOne({
      userId,
      stripeSubscriptionId: subscriptionId,
    });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this subscription',
      });
    }

    // Cancel subscription
    const subscription = await stripeService.cancelSubscription(
      subscriptionId,
      immediately
    );

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled',
      data: {
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelledAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel subscription',
    });
  }
};

/**
 * Get payment history
 * GET /api/payments/history
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (page - 1) * limit;

    // Get payments
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Payment.countDocuments({ userId });

    res.status(200).json({
      success: true,
      message: 'Payment history retrieved',
      data: payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve payment history',
    });
  }
};

/**
 * Create Stripe billing portal session
 * POST /api/payments/portal
 */
exports.createPortalSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { returnUrl = process.env.FRONTEND_URL } = req.body;

    // Get user
    const user = await User.findById(userId);
    if (!user || !user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'User not found or no Stripe customer',
      });
    }

    // Create billing portal session
    const session = await stripeService.createPortalSession(
      user.stripeCustomerId,
      returnUrl
    );

    res.status(200).json({
      success: true,
      message: 'Billing portal session created',
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    console.error('Create portal session error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create billing portal session',
    });
  }
};

/**
 * Get payment details
 * GET /api/payments/:id
 */
exports.getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get payment
    const payment = await Payment.findById(id);
    if (!payment || payment.userId.toString() !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment details retrieved',
      data: payment,
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve payment details',
    });
  }
};

/**
 * Create setup intent for saving payment method
 * POST /api/payments/setup-intent
 */
exports.createSetupIntent = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get or create Stripe customer
    const customerId = await stripeService.getOrCreateCustomer(user);

    // Create setup intent
    const intent = await stripeService.createSetupIntent(customerId);

    res.status(200).json({
      success: true,
      message: 'Setup intent created',
      data: {
        clientSecret: intent.client_secret,
        intentId: intent.id,
      },
    });
  } catch (error) {
    console.error('Create setup intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create setup intent',
    });
  }
};

/**
 * Confirm payment (called after client-side payment processing)
 * POST /api/payments/confirm
 */
exports.confirmPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { intentId, paymentMethodId } = req.body;

    // Confirm payment intent
    const intent = await stripeService.confirmPaymentIntent(
      intentId,
      paymentMethodId
    );

    // Update payment record
    const payment = await Payment.findOne({
      stripeIntentId: intentId,
    });

    if (payment) {
      payment.status = intent.status === 'succeeded' ? 'completed' : 'failed';
      await payment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed',
      data: {
        status: intent.status,
        intentId: intent.id,
      },
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to confirm payment',
    });
  }
};
