const Member = require('../models/Member');
const GymSubscription = require('../models/GymSubscription');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Notification = require('../models/Notification');
const stripeService = require('../services/stripe.service');
const emailService = require('../services/email.service');

/**
 * Handle Stripe webhook events
 * POST /api/webhooks/stripe
 */
exports.handleStripeWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    // Verify webhook signature
    const event = stripeService.verifyWebhookSignature(req.body, signature);

    console.log(`Webhook event received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // Subscription created
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      // Subscription updated
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      // Subscription deleted/canceled
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      // Payment succeeded
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      // Payment failed
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object);
        break;

      // Payment intent succeeded (one-time payments)
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      // Payment intent failed
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Acknowledge receipt of webhook
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Return 400 for webhook signature verification failure
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

/**
 * Handle: customer.subscription.created
 * Update Member/GymSubscription status to 'active'
 */
async function handleSubscriptionCreated(subscription) {
  try {
    console.log(`Processing subscription created: ${subscription.id}`);

    // Find payment record by subscription ID
    const payment = await Payment.findOne({
      stripeSubscriptionId: subscription.id,
    });

    if (!payment) {
      console.log(`No payment record found for subscription ${subscription.id}`);
      return;
    }

    // Update payment status
    payment.status = 'completed';
    payment.stripeChargeId = subscription.latest_invoice?.charge;
    await payment.save();

    // Update member record if exists
    const member = await Member.findOne({
      userId: payment.userId,
    });

    if (member) {
      member.membershipStatus = 'active';
      member.stripeSubscriptionId = subscription.id;
      member.stripeCustomerId = subscription.customer;
      member.memberSince = new Date();
      member.membershipExpiry = new Date(
        subscription.current_period_end * 1000
      );
      await member.save();

      // Send welcome email
      const user = await User.findById(payment.userId);
      if (user) {
        await emailService.sendWelcomeEmail(user);

        // Create notification
        await Notification.create({
          userId: payment.userId,
          type: 'subscription',
          title: 'Subscription Activated',
          message: 'Your gym membership is now active!',
          data: {
            subscriptionId: subscription.id,
            nextBillingDate: new Date(subscription.current_period_end * 1000),
          },
        });
      }
    }

    console.log(`Subscription ${subscription.id} marked as active`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

/**
 * Handle: customer.subscription.updated
 * Sync plan changes, update period dates
 */
async function handleSubscriptionUpdated(subscription) {
  try {
    console.log(`Processing subscription updated: ${subscription.id}`);

    // Find member by subscription ID
    const member = await Member.findOne({
      stripeSubscriptionId: subscription.id,
    });

    if (!member) {
      console.log(`No member found for subscription ${subscription.id}`);
      return;
    }

    // Update membership dates
    member.membershipExpiry = new Date(
      subscription.current_period_end * 1000
    );

    // If subscription is paused
    if (subscription.pause_collection) {
      member.membershipStatus = 'frozen';
    } else if (subscription.status === 'active') {
      member.status = 'active';
    }

    await member.save();

    // Create notification for user
    const user = await User.findById(member.userId);
    if (user) {
      await Notification.create({
        userId: member.userId,
        type: 'subscription',
        title: 'Subscription Updated',
        message: 'Your subscription details have been updated',
        data: {
          subscriptionId: subscription.id,
          newExpiryDate: member.membershipExpiryDate,
        },
      });
    }

    console.log(`Subscription ${subscription.id} updated`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

/**
 * Handle: customer.subscription.deleted
 * Set status 'canceled', restrict access
 */
async function handleSubscriptionDeleted(subscription) {
  try {
    console.log(`Processing subscription deleted: ${subscription.id}`);

    // Find member by subscription ID
    const member = await Member.findOne({
      stripeSubscriptionId: subscription.id,
    });

    if (!member) {
      console.log(`No member found for subscription ${subscription.id}`);
      return;
    }

    // Update membership status
    member.membershipStatus = 'canceled';
    await member.save();

    // Send cancellation email
    const user = await User.findById(member.userId);
    if (user) {
      await emailService.sendCancellationConfirmationEmail(user);

      // Create notification
      await Notification.create({
        userId: member.userId,
        type: 'subscription',
        title: 'Membership Canceled',
        message: 'Your membership has been canceled',
        data: {
          subscriptionId: subscription.id,
        },
      });
    }

    console.log(`Subscription ${subscription.id} canceled - member access revoked`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

/**
 * Handle: invoice.payment_succeeded
 * Record payment, send receipt email
 */
async function handleInvoicePaymentSucceeded(invoice) {
  try {
    console.log(`Processing invoice payment succeeded: ${invoice.id}`);

    // Update payment record
    const payment = await Payment.findOne({
      stripeSubscriptionId: invoice.subscription,
    }).sort({ createdAt: -1 });

    if (payment) {
      payment.status = 'completed';
      payment.stripeChargeId = invoice.charge;
      payment.amount = invoice.amount_paid / 100;
      await payment.save();
    }

    // Get user and send receipt
    if (invoice.customer_email) {
      const user = await User.findOne({ email: invoice.customer_email });

      if (user) {
        await emailService.sendPaymentReceiptEmail(user, {
          invoiceId: invoice.id,
          amount: invoice.amount_paid / 100,
          date: new Date(invoice.created * 1000),
          description: invoice.description,
        });

        // Create notification
        await Notification.create({
          userId: user._id,
          type: 'payment',
          title: 'Payment Received',
          message: `Payment of $${(invoice.amount_paid / 100).toFixed(2)} has been processed`,
          data: {
            invoiceId: invoice.id,
            amount: invoice.amount_paid / 100,
          },
        });
      }
    }

    console.log(`Invoice ${invoice.id} payment recorded`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

/**
 * Handle: invoice.payment_failed
 * Set status 'past_due', send dunning email, notify admin
 */
async function handleInvoicePaymentFailed(invoice) {
  try {
    console.log(`Processing invoice payment failed: ${invoice.id}`);

    // Update member status
    const member = await Member.findOne({
      stripeSubscriptionId: invoice.subscription,
    });

    if (member) {
      member.membershipStatus = 'past_due';
      member.lastPaymentFailureDate = new Date();
      await member.save();

      // Send dunning email
      const user = await User.findById(member.userId);
      if (user) {
        await emailService.sendPaymentFailedEmail(user, {
          invoiceId: invoice.id,
          amount: invoice.amount_due / 100,
          nextRetryDate: invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000)
            : null,
        });

        // Create notification
        await Notification.create({
          userId: member.userId,
          type: 'payment',
          title: 'Payment Failed',
          message: `Payment of $${(invoice.amount_due / 100).toFixed(2)} failed. Please update your payment method.`,
          data: {
            invoiceId: invoice.id,
            amount: invoice.amount_due / 100,
          },
        });
      }
    }

    // Notify admin (create admin notification)
    const adminUser = await User.findOne({ role: { $in: ['admin', 'super_admin'] } });
    if (adminUser) {
      await Notification.create({
        userId: adminUser._id,
        type: 'admin_alert',
        title: 'Payment Failure Alert',
        message: `Invoice ${invoice.id} payment failed (amount: $${(invoice.amount_due / 100).toFixed(2)})`,
        data: {
          invoiceId: invoice.id,
          customerId: invoice.customer,
        },
      });
    }

    console.log(`Invoice ${invoice.id} payment failed - member notified`);
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

/**
 * Handle: payment_intent.succeeded
 * For one-time payments, record transaction
 */
async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    console.log(`Processing payment intent succeeded: ${paymentIntent.id}`);

    // Update payment record
    const payment = await Payment.findOne({
      stripeIntentId: paymentIntent.id,
    });

    if (payment) {
      payment.status = 'completed';
      payment.stripeChargeId = paymentIntent.charges.data[0]?.id;
      await payment.save();

      // Send receipt
      const user = await User.findById(payment.userId);
      if (user) {
        await emailService.sendPaymentReceiptEmail(user, {
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          date: new Date(paymentIntent.created * 1000),
          type: payment.type,
        });

        // Create notification
        await Notification.create({
          userId: payment.userId,
          type: 'payment',
          title: 'Payment Successful',
          message: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} confirmed`,
          data: {
            transactionId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
          },
        });
      }
    }

    console.log(`Payment intent ${paymentIntent.id} marked as succeeded`);
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

/**
 * Handle: payment_intent.payment_failed
 * Record failed payment attempt
 */
async function handlePaymentIntentFailed(paymentIntent) {
  try {
    console.log(`Processing payment intent failed: ${paymentIntent.id}`);

    // Update payment record
    const payment = await Payment.findOne({
      stripeIntentId: paymentIntent.id,
    });

    if (payment) {
      payment.status = 'failed';
      await payment.save();

      // Notify user
      const user = await User.findById(payment.userId);
      if (user) {
        await emailService.sendPaymentFailedEmail(user, {
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          reason: paymentIntent.last_payment_error?.message,
        });

        // Create notification
        await Notification.create({
          userId: payment.userId,
          type: 'payment',
          title: 'Payment Failed',
          message: `Payment of $${(paymentIntent.amount / 100).toFixed(2)} could not be processed`,
          data: {
            transactionId: paymentIntent.id,
            error: paymentIntent.last_payment_error?.message,
          },
        });
      }
    }

    console.log(`Payment intent ${paymentIntent.id} marked as failed`);
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}
