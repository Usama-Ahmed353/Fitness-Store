const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const ClassBooking = require('../models/ClassBooking');
const Member = require('../models/Member');
const User = require('../models/User');
const Gym = require('../models/Gym');
const Trainer = require('../models/Trainer');
const Class = require('../models/Class');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private (verified member)
exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { targetType, targetId, rating, title, body } = req.body;

    const user = await User.findById(req.user.id);

    // Verify user is a member if reviewing gym/class
    let isVerified = false;
    if (targetType === 'gym') {
      const member = await Member.findOne({
        userId: req.user.id,
        gymId: targetId,
        membershipStatus: 'active',
      });
      isVerified = !!member;
    } else if (targetType === 'trainer') {
      // Check if user has booked sessions with trainer
      isVerified = true; // Simplified - would check actual bookings
    } else if (targetType === 'class') {
      // Check if user attended the class
      const attendance = await ClassBooking.findOne({
        classId: targetId,
        status: 'attended',
      });
      isVerified = !!attendance;
    }

    // Check for existing review
    const existingReview = await Review.findOne({
      authorId: req.user.id,
      targetType,
      targetId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this item',
      });
    }

    const review = await Review.create({
      authorId: req.user.id,
      targetType,
      targetId,
      rating,
      title,
      body,
      isVerified,
      isApproved: true, // Auto-approve for now
    });

    // Update rating on target
    const reviews = await Review.find({
      targetType,
      targetId,
      isApproved: true,
    });

    const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

    if (targetType === 'gym') {
      await Gym.findByIdAndUpdate(targetId, {
        rating: avgRating,
        reviewCount: reviews.length,
      });
    } else if (targetType === 'trainer') {
      await Trainer.findByIdAndUpdate(targetId, {
        rating: avgRating,
        reviewCount: reviews.length,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const { targetType, targetId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    if (!targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'targetType and targetId are required',
      });
    }

    const reviews = await Review.find({
      targetType,
      targetId,
      isApproved: true,
    })
      .populate('authorId', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      targetType,
      targetId,
      isApproved: true,
    });

    // Calculate rating distribution
    const allReviews = await Review.find({
      targetType,
      targetId,
      isApproved: true,
    });

    const ratingDistribution = {
      5: allReviews.filter((r) => r.rating === 5).length,
      4: allReviews.filter((r) => r.rating === 4).length,
      3: allReviews.filter((r) => r.rating === 3).length,
      2: allReviews.filter((r) => r.rating === 2).length,
      1: allReviews.filter((r) => r.rating === 1).length,
    };

    const avgRating = (
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    ).toFixed(1);

    res.status(200).json({
      success: true,
      data: reviews,
      stats: {
        averageRating: avgRating,
        totalReviews: total,
        ratingDistribution,
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark review helpful
// @route   PATCH /api/reviews/:id/helpful
// @access  Private
exports.markReviewHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.helpfulVotes += 1;
    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review marked as helpful',
      data: review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (author only)
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.authorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews',
      });
    }

    await Review.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
