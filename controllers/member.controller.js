const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_API_KEY || 'sk_test_placeholder');
const Member = require('../models/Member');
const User = require('../models/User');
const Gym = require('../models/Gym');
const ClassBooking = require('../models/ClassBooking');
const Class = require('../models/Class');

// @desc    Join a gym (create membership)
// @route   POST /api/members/join
// @access  Private
exports.joinGym = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { gymId, plan, paymentMethodId } = req.body;

    // Verify gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Check if already a member
    const existingMember = await Member.findOne({
      userId: req.user.id,
      gymId,
      membershipStatus: 'active',
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'You are already an active member of this gym',
      });
    }

    const user = await User.findById(req.user.id);

    // Plan pricing
    const planPricing = {
      base: 29.99,
      peak: 49.99,
      peak_results: 79.99,
      peak_plus: 99.99,
    };

    const price = planPricing[plan] * 100; // Convert to cents

    try {
      // Create or get Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          payment_method: paymentMethodId,
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
        customerId = customer.id;
        user.stripeCustomerId = customerId;
        await user.save();
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${gym.name} - ${plan} Plan`,
              },
              unit_amount: price,
              recurring: {
                interval: 'month',
              },
            },
          },
        ],
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
      });

      // Generate referral code
      const referralCode = `REF-${req.user.id}-${gym._id}`.substring(0, 20);

      // Create member
      const member = await Member.create({
        userId: req.user.id,
        gymId,
        membershipPlan: plan,
        membershipStatus: 'active',
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        memberSince: new Date(),
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
        referralCode,
      });

      // Update gym member count
      gym.memberCount += 1;
      await gym.save();

      res.status(201).json({
        success: true,
        message: 'Successfully joined gym membership',
        data: member,
      });
    } catch (stripeError) {
      res.status(400).json({
        success: false,
        message: `Stripe error: ${stripeError.message}`,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's membership details
// @route   GET /api/members/me
// @access  Private
exports.getMyMembership = async (req, res, next) => {
  try {
    const member = await Member.findOne({ userId: req.user.id })
      .populate('userId', 'firstName lastName email profilePhoto')
      .populate('gymId', 'name slug logo')
      .populate('referredBy', 'firstName lastName');

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'No active membership found',
      });
    }

    // Get class history
    const classHistory = await ClassBooking.find({
      memberId: member._id,
      status: { $in: ['attended', 'no_show'] },
    })
      .populate('classId', 'name category schedule')
      .sort({ createdAt: -1 })
      .limit(20);

    // Get stats
    const stats = {
      totalCheckIns: member.checkInCount,
      classesAttended: await ClassBooking.countDocuments({
        memberId: member._id,
        status: 'attended',
      }),
      classesBooked: await ClassBooking.countDocuments({
        memberId: member._id,
        status: 'booked',
      }),
      badges: member.badges.length,
      points: member.points,
    };

    res.status(200).json({
      success: true,
      data: {
        ...member.toObject(),
        classHistory,
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Freeze membership
// @route   PATCH /api/members/me/freeze
// @access  Private
exports.freezeMembership = async (req, res, next) => {
  try {
    const { freezeDurationMonths = 1 } = req.body;

    if (freezeDurationMonths > 3) {
      return res.status(400).json({
        success: false,
        message: 'Cannot freeze membership for more than 3 months per year',
      });
    }

    const member = await Member.findOne({ userId: req.user.id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    if (member.membershipStatus !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Can only freeze active memberships',
      });
    }

    member.membershipStatus = 'frozen';
    member.membershipExpiry = new Date(
      Date.now() + freezeDurationMonths * 30 * 24 * 60 * 60 * 1000
    );
    await member.save();

    res.status(200).json({
      success: true,
      message: `Membership frozen for ${freezeDurationMonths} month(s)`,
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel membership
// @route   PATCH /api/members/me/cancel
// @access  Private
exports.cancelMembership = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const member = await Member.findOne({ userId: req.user.id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Membership not found' });
    }

    // Cancel Stripe subscription
    if (member.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(member.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      } catch (stripeError) {
        console.error('Stripe cancellation error:', stripeError);
      }
    }

    member.membershipStatus = 'canceled';
    member.canceledAt = new Date();
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Membership canceled successfully',
      data: member,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check-in to gym
// @route   POST /api/members/checkin
// @access  Private
exports.checkInToGym = async (req, res, next) => {
  try {
    const { gymId, qrCode } = req.body;

    const member = await Member.findOne({
      userId: req.user.id,
      gymId,
      membershipStatus: 'active',
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'No active membership at this gym',
      });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingCheckIn = await Member.findOne({
      _id: member._id,
      lastCheckIn: { $gte: today },
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
      });
    }

    member.checkInCount += 1;
    member.lastCheckIn = new Date();
    member.points += 10; // Award points for check-in

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        checkInCount: member.checkInCount,
        pointsAwarded: 10,
        totalPoints: member.points,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get check-in history
// @route   GET /api/members/me/checkins
// @access  Private
exports.getMyCheckIns = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const member = await Member.findOne({ userId: req.user.id });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    // Get check-in timestamp from member's document (simplified - would need separate checkin collection for full history)
    const memberData = {
      checkInCount: member.checkInCount,
      lastCheckIn: member.lastCheckIn,
    };

    res.status(200).json({
      success: true,
      data: memberData,
      message: 'Check-in history retrieved',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's class bookings
// @route   GET /api/members/me/bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const memberIds = (await Member.find({ userId: req.user.id }).select('_id')).map((m) => m._id);

    if (!memberIds.length) {
      return res.status(200).json({ success: true, data: [] });
    }

    const bookings = await ClassBooking.find({ memberId: { $in: memberIds } })
      .populate({
        path: 'classId',
        populate: [
          { path: 'gymId', select: 'name' },
          {
            path: 'instructorId',
            populate: { path: 'userId', select: 'firstName lastName' },
          },
        ],
      })
      .sort({ createdAt: -1 });

    const now = new Date();
    const data = bookings
      .filter((booking) => booking.classId)
      .map((booking) => {
        const cls = booking.classId;
        const scheduleDate = cls.schedule?.date ? new Date(cls.schedule.date) : null;
        const isPastBySchedule = scheduleDate ? scheduleDate < now : false;

        let status = 'upcoming';
        if (booking.status === 'canceled') {
          status = 'canceled';
        } else if (booking.waitlistPosition) {
          status = 'waitlist';
        } else if (booking.status === 'attended' || booking.status === 'no_show' || isPastBySchedule) {
          status = 'past';
        }

        const instructorUser = cls.instructorId?.userId;

        return {
          _id: booking._id,
          classId: cls._id,
          className: cls.name,
          instructor:
            instructorUser
              ? `${instructorUser.firstName || ''} ${instructorUser.lastName || ''}`.trim()
              : 'Instructor',
          date: scheduleDate ? scheduleDate.toISOString().split('T')[0] : booking.createdAt.toISOString().split('T')[0],
          time: cls.schedule?.time || '00:00',
          duration: cls.duration || 60,
          gym: cls.gymId?.name || 'Gym',
          status,
          attended: booking.status === 'attended',
          difficulty: cls.difficulty || 'intermediate',
          waitlistPosition: booking.waitlistPosition || null,
          bookedAt: booking.createdAt,
          canceledAt: booking.canceledAt,
        };
      });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all members (admin)
// @route   GET /api/members
// @access  Private (admin)
exports.getAllMembers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, gymId, status } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (gymId) query.gymId = gymId;
    if (status) query.membershipStatus = status;

    const members = await Member.find(query)
      .populate('userId', 'firstName lastName email')
      .populate('gymId', 'name slug')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Member.countDocuments(query);

    res.status(200).json({
      success: true,
      data: members,
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
