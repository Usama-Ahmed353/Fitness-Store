const mongoose = require('mongoose');

const classBookingSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
    },
    status: {
      type: String,
      enum: ['booked', 'attended', 'no_show', 'canceled'],
      default: 'booked',
    },
    bookedAt: {
      type: Date,
      default: Date.now,
    },
    canceledAt: Date,
    checkInAt: Date,
    waitlistPosition: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClassBooking', classBookingSchema);
