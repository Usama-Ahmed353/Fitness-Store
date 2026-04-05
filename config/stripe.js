const stripe = require('stripe')(process.env.STRIPE_API_KEY || 'sk_test_placeholder');

module.exports = stripe;
