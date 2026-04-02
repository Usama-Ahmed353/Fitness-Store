const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    type: {
      type: String,
      enum: ['check_in', 'classes', 'weight_loss', 'custom'],
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    participants: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Member',
        },
        progress: Number,
        isCompleted: Boolean,
      },
    ],
    reward: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);
