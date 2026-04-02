const stripe = require('../config/stripe');

/**
 * Stripe Service - All Stripe API operations
 * Handles customers, subscriptions, payments, and billing
 */

/**
 * Create a Stripe customer linked to user
 * @param {Object} user - User object from MongoDB
 * @returns {Promise<Object>} Stripe customer object
 */
exports.createCustomer = async (user) => {
  try {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user._id.toString(),
      },
    });

    // Save Stripe customer ID to user
    user.stripeCustomerId = customer.id;
    await user.save();

    return customer;
  } catch (error) {
    throw new Error(`Failed to create Stripe customer: ${error.message}`);
  }
};

/**
 * Get or create Stripe customer
 * @param {Object} user - User object
 * @returns {Promise<string>} Stripe customer ID
 */
exports.getOrCreateCustomer = async (user) => {
  try {
    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const customer = await this.createCustomer(user);
    return customer.id;
  } catch (error) {
    throw new Error(`Failed to get/create customer: ${error.message}`);
  }
};

/**
 * Create a recurring subscription
 * @param {string} customerId - Stripe customer ID
 * @param {string} priceId - Stripe price ID for the plan
 * @param {string} paymentMethodId - Stripe payment method ID
 * @returns {Promise<Object>} Stripe subscription object
 */
exports.createSubscription = async (customerId, priceId, paymentMethodId) => {
  try {
    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Set as default payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {boolean} immediately - Cancel immediately (true) or at period end (false)
 * @returns {Promise<Object>} Updated subscription object
 */
exports.cancelSubscription = async (subscriptionId, immediately = false) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: !immediately,
    });

    // If immediate cancellation, actually delete it
    if (immediately) {
      return await stripe.subscriptions.del(subscriptionId);
    }

    return subscription;
  } catch (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
};

/**
 * Create one-time payment intent
 * @param {number} amount - Amount in cents (e.g., 9999 = $99.99)
 * @param {string} currency - Currency code (e.g., 'usd')
 * @param {Object} metadata - Custom metadata to attach
 * @returns {Promise<Object>} Payment intent object
 */
exports.createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });

    return intent;
  } catch (error) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
};

/**
 * Confirm payment intent (after client-side payment processing)
 * @param {string} intentId - Payment intent ID
 * @param {string} paymentMethodId - Payment method to use
 * @returns {Promise<Object>} Confirmed intent
 */
exports.confirmPaymentIntent = async (intentId, paymentMethodId) => {
  try {
    const intent = await stripe.paymentIntents.confirm(intentId, {
      payment_method: paymentMethodId,
    });

    return intent;
  } catch (error) {
    throw new Error(`Failed to confirm payment intent: ${error.message}`);
  }
};

/**
 * Create Stripe billing portal session
 * Allows users to manage subscriptions, payment methods, etc.
 * @param {string} customerId - Stripe customer ID
 * @param {string} returnUrl - URL to return to after portal
 * @returns {Promise<Object>} Session with URL
 */
exports.createPortalSession = async (customerId, returnUrl) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
};

/**
 * Create setup intent for saving payment method
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Object>} Setup intent object
 */
exports.createSetupIntent = async (customerId) => {
  try {
    const intent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card'],
    });

    return intent;
  } catch (error) {
    throw new Error(`Failed to create setup intent: ${error.message}`);
  }
};

/**
 * Retrieve subscription details
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>} Subscription object
 */
exports.retrieveSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    throw new Error(`Failed to retrieve subscription: ${error.message}`);
  }
};

/**
 * Update subscription (change plan, pause, etc.)
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {Object} params - Update parameters
 * @returns {Promise<Object>} Updated subscription
 */
exports.updateSubscription = async (subscriptionId, params) => {
  try {
    const subscription = await stripe.subscriptions.update(
      subscriptionId,
      params
    );
    return subscription;
  } catch (error) {
    throw new Error(`Failed to update subscription: ${error.message}`);
  }
};

/**
 * Retrieve invoice
 * @param {string} invoiceId - Stripe invoice ID
 * @returns {Promise<Object>} Invoice object
 */
exports.retrieveInvoice = async (invoiceId) => {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error) {
    throw new Error(`Failed to retrieve invoice: ${error.message}`);
  }
};

/**
 * Retrieve payment intent
 * @param {string} intentId - Payment intent ID
 * @returns {Promise<Object>} Payment intent
 */
exports.retrievePaymentIntent = async (intentId) => {
  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return intent;
  } catch (error) {
    throw new Error(`Failed to retrieve payment intent: ${error.message}`);
  }
};

/**
 * List customer's subscriptions
 * @param {string} customerId - Stripe customer ID
 * @returns {Promise<Array>} List of subscriptions
 */
exports.listSubscriptions = async (customerId) => {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 100,
    });

    return subscriptions.data;
  } catch (error) {
    throw new Error(`Failed to list subscriptions: ${error.message}`);
  }
};

/**
 * Verify webhook signature
 * @param {string} body - Raw request body
 * @param {string} signature - Signature from event
 * @returns {Object} Parsed event
 */
exports.verifyWebhookSignature = (body, signature) => {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    return event;
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
};
