const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');
const Gym = require('../models/Gym');
const Member = require('../models/Member');
const Payment = require('../models/Payment');

/**
 * Middleware: Check if user is admin
 */
const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user?.id);
    if (user && (user.role === 'admin' || user.role === 'super_admin')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'Admin access required',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Authorization error',
    });
  }
};

/**
 * Get all users with filtering
 * GET /api/admin/users?role=member&status=active
 */
router.get('/users', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { role, status, isActive, page = 1, limit = 20 } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (typeof isActive !== 'undefined') {
      filter.isActive = String(isActive) === 'true';
    } else if (status) {
      // Backward-compatible alias for old clients.
      if (status === 'active') filter.isActive = true;
      if (status === 'inactive') filter.isActive = false;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password -refreshToken')
      .limit(Number(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
});

/**
 * Get admin dashboard analytics
 * GET /api/admin/analytics
 */
router.get('/analytics', verifyToken, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGyms = await Gym.countDocuments();
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({
      membershipStatus: 'active',
    });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
      { $limit: 12 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalGyms,
          totalMembers,
          activeMembers,
          totalRevenue: totalRevenue[0]?.total || 0,
          averageOrderValue:
            totalRevenue[0]?.total &&
            Math.round(totalRevenue[0].total / totalUsers),
        },
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
});

/**
 * Verify gym (approve gym owner)
 * POST /api/admin/gyms/:gymId/verify
 */
router.post('/gyms/:gymId/verify', verifyToken, checkAdmin, async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.gymId,
      {
        verified: true,
        verifiedAt: new Date(),
        verifiedBy: req.userId,
      },
      { new: true }
    );

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Gym verified successfully',
      data: gym,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error verifying gym',
      error: error.message,
    });
  }
});

/**
 * Get all pending gym verifications
 * GET /api/admin/gyms/pending
 */
router.get('/gyms/pending', verifyToken, checkAdmin, async (req, res) => {
  try {
    const pendingGyms = await Gym.find({ verified: false }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      count: pendingGyms.length,
      data: pendingGyms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending gyms',
      error: error.message,
    });
  }
});

/**
 * Get transaction history
 * GET /api/admin/transactions?status=completed&startDate=2026-01-01&endDate=2026-03-24
 */
router.get('/transactions', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 50 } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (page - 1) * limit;

    const transactions = await Payment.find(filter)
      .populate('userId', 'firstName lastName email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message,
    });
  }
});

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:userId
 */
router.delete('/users/:userId', verifyToken, checkAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Also delete member and payment records
    await Member.deleteMany({ userId: req.params.userId });
    await Payment.deleteMany({ userId: req.params.userId });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

/**
 * Update user role or status
 * PATCH /api/admin/users/:userId
 */
router.patch('/users/:userId', verifyToken, checkAdmin, async (req, res) => {
  try {
    const { role, isActive } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (typeof isActive === 'boolean') updates.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
});

module.exports = router;
