const mongoose = require('mongoose');

const classSchema = new mongoose.Schema(
  {
    gymId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gym',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['strength', 'ride', 'mind_body', 'dance', 'cardio', 'specialty', 'hiit'],
      required: true,
    },
    description: String,
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
    },
    duration: {
      type: Number,
      required: true,
      default: 60,
    },
    maxCapacity: {
      type: Number,
      required: true,
    },
    currentBookings: {
      type: Number,
      default: 0,
    },
    schedule: {
      dayOfWeek: String,
      time: String,
      recurring: Boolean,
    },
    location: String,
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    equipment: [String],
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    isCanceled: {
      type: Boolean,
      default: false,
    },
    cancelReason: String,
    thumbnail: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Class', classSchema);
