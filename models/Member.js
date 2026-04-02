const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    membershipPlan: {
      type: String,
      enum: ['base', 'peak', 'peak_results', 'peak_plus'],
      default: 'base',
    },
    membershipStatus: {
      type: String,
      enum: ['active', 'frozen', 'canceled', 'expired'],
      default: 'active',
    },
    stripeSubscriptionId: String,
    stripeCustomerId: String,
    memberSince: Date,
    membershipExpiry: Date,
    checkInCount: {
      type: Number,
      default: 0,
    },
    lastCheckIn: Date,
    goals: [String],
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    emergencyContact: {
      name: String,
      phone: String,
    },
    medicalNotes: String,
    badges: [String],
    points: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Member', memberSchema);
