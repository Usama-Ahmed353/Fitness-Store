const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Member = require('../models/Member');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Get all member goals
 * GET /api/members/:id/goals
 */
router.get('/:id/goals', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        memberId: member._id,
        goals: member.goals || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching goals',
      error: error.message,
    });
  }
});

/**
 * Add fitness goal to member
 * POST /api/members/:id/goals
 */
router.post('/:id/goals', verifyToken, async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal || typeof goal !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Goal must be a non-empty string',
      });
    }

    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    // Prevent duplicate goals
    if (member.goals && member.goals.includes(goal)) {
      return res.status(400).json({
        success: false,
        message: 'Goal already exists',
      });
    }

    if (!member.goals) {
      member.goals = [];
    }
    member.goals.push(goal);
    await member.save();

    res.status(201).json({
      success: true,
      message: 'Goal added successfully',
      data: {
        goals: member.goals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding goal',
      error: error.message,
    });
  }
});

/**
 * Get member referrals
 * GET /api/members/:id/referrals
 */
router.get('/:id/referrals', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    // Find members who were referred by this member
    const referrals = await Member.find({
      referredBy: member._id,
    }).select('userId membershipPlan membershipStatus memberSince');

    // Get user details for referrals
    const referralDetails = await Promise.all(
      referrals.map(async (ref) => {
        const user = await User.findById(ref.userId).select(
          'firstName lastName email'
        );
        return {
          _id: ref._id,
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          email: user?.email,
          status: ref.membershipStatus,
          joinedDate: ref.memberSince,
          plan: ref.membershipPlan,
        };
      })
    );

    res.status(200).json({
      success: true,
      referralCode: member.referralCode,
      totalReferrals: referralDetails.length,
      data: referralDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching referrals',
      error: error.message,
    });
  }
});

/**
 * Get member stats and profile
 * GET /api/members/:id/stats
 */
router.get('/:id/stats', verifyToken, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    const user = await User.findById(member.userId).select(
      'firstName lastName email'
    );

    res.status(200).json({
      success: true,
      data: {
        member: {
          _id: member._id,
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          email: user?.email,
          membershipPlan: member.membershipPlan,
          membershipStatus: member.membershipStatus,
          memberSince: member.memberSince,
          membershipExpiry: member.membershipExpiry,
          checkInCount: member.checkInCount,
          lastCheckIn: member.lastCheckIn,
          fitnessLevel: member.fitnessLevel,
          goals: member.goals,
          badges: member.badges,
          points: member.points,
          totalReferrals: await Member.countDocuments({
            referredBy: member._id,
          }),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
});

/**
 * Update member registration info
 * PATCH /api/members/:id
 */
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { emergencyContact, medicalNotes, fitnessLevel } = req.body;

    const updates = {};
    if (emergencyContact) updates.emergencyContact = emergencyContact;
    if (medicalNotes) updates.medicalNotes = medicalNotes;
    if (fitnessLevel) updates.fitnessLevel = fitnessLevel;

    const member = await Member.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating member',
      error: error.message,
    });
  }
});

module.exports = router;
