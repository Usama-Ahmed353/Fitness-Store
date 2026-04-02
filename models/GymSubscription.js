const mongoose = require('mongoose');

const gymSubscriptionSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    plan: {
      type: String,
      enum: ['starter', 'professional', 'enterprise'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'trialing', 'past_due', 'canceled'],
      default: 'trialing',
    },
    stripeSubscriptionId: String,
    stripeCustomerId: String,
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual'],
      default: 'monthly',
    },
    price: Number,
    features: {
      maxMembers: Number,
      maxTrainers: Number,
      maxClasses: Number,
      hasAnalytics: Boolean,
      hasWhiteLabel: Boolean,
      hasSMS: Boolean,
      hasVideoClasses: Boolean,
      hasNutrition: Boolean,
    },
    trialEndsAt: Date,
    canceledAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GymSubscription', gymSubscriptionSchema);
