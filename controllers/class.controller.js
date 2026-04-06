const { validationResult } = require('express-validator');
const Class = require('../models/Class');
const ClassBooking = require('../models/ClassBooking');
const Member = require('../models/Member');
const Gym = require('../models/Gym');
const Notification = require('../models/Notification');

// @desc    Get all classes with filters
// @route   GET /api/classes
// @access  Public
exports.getClasses = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { gymId, category, date, instructorId, difficulty, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, isCanceled: false };

    if (gymId) query.gymId = gymId;
    if (category) query.category = category;
    if (instructorId) query.instructorId = instructorId;
    if (difficulty) query.difficulty = difficulty;

    const classes = await Class.find(query)
      .populate({
        path: 'instructorId',
        select: 'userId rating',
        populate: { path: 'userId', select: 'firstName lastName profilePhoto' },
      })
      .populate('gymId', 'name slug')
      .sort({ 'schedule.time': 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Class.countDocuments(query);

    // Add booking availability for each class
    const classesWithAvailability = await Promise.all(
      classes.map(async (cls) => {
        const bookingCount = await ClassBooking.countDocuments({
          classId: cls._id,
          status: 'booked',
        });

        return {
          ...cls.toObject(),
          availableSpots: cls.maxCapacity - bookingCount,
          currentBookings: bookingCount,
          isFull: bookingCount >= cls.maxCapacity,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: classesWithAvailability,
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

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Public
exports.getClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cls = await Class.findById(id)
      .populate({
        path: 'instructorId',
        select: 'userId bio rating specializations',
        populate: { path: 'userId', select: 'firstName lastName profilePhoto' },
      })
      .populate('gymId', 'name address phone');

    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const bookingCount = await ClassBooking.countDocuments({
      classId: id,
      status: 'booked',
    });

    res.status(200).json({
      success: true,
      data: {
        ...cls.toObject(),
        availableSpots: cls.maxCapacity - bookingCount,
        currentBookings: bookingCount,
        isFull: bookingCount >= cls.maxCapacity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create class (trainer/gym owner)
// @route   POST /api/classes
// @access  Private (gym_owner, trainer)
exports.createClass = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      gymId,
      name,
      category,
      description,
      instructorId,
      duration,
      maxCapacity,
      schedule,
      location,
      difficulty,
      equipment,
      tags,
    } = req.body;

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Verify ownership
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create classes for this gym',
      });
    }

    const cls = await Class.create({
      gymId,
      name,
      category,
      description,
      instructorId,
      duration,
      maxCapacity,
      schedule,
      location,
      difficulty,
      equipment: equipment ? equipment.split(',').map((e) => e.trim()) : [],
      tags: tags ? tags.split(',').map((t) => t.trim()) : [],
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: cls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book a class
// @route   POST /api/classes/:id/book
// @access  Private
exports.bookClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    if (cls.isCanceled) {
      return res.status(400).json({
        success: false,
        message: 'This class has been canceled',
      });
    }

    const memberProfiles = await Member.find({
      userId: req.user.id,
      membershipStatus: { $ne: 'canceled' },
    });

    let member = memberProfiles.find((m) => String(m.gymId) === String(cls.gymId));

    // Auto-provision a basic membership profile for this gym if none exists.
    if (!member) {
      member = await Member.create({
        userId: req.user.id,
        gymId: cls.gymId,
        membershipPlan: 'base',
        membershipStatus: 'active',
        memberSince: new Date(),
      });
    }

    // Check for duplicate booking
    const existingBooking = await ClassBooking.findOne({
      classId: id,
      memberId: member._id,
      status: { $ne: 'canceled' },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'You are already booked for this class',
      });
    }

    // Check capacity
    const currentBookings = await ClassBooking.countDocuments({
      classId: id,
      status: 'booked',
    });

    let bookingStatus = 'booked';
    let waitlistPosition = null;

    if (currentBookings >= cls.maxCapacity) {
      // Add to waitlist
      bookingStatus = 'booked'; // Still show as booked but with waitlist position
      const waitlistCount = await ClassBooking.countDocuments({
        classId: id,
        status: 'booked',
        waitlistPosition: { $exists: true },
      });
      waitlistPosition = waitlistCount + 1;
    }

    const booking = await ClassBooking.create({
      classId: id,
      memberId: member._id,
      status: bookingStatus,
      waitlistPosition,
    });

    // Update class current bookings
    cls.currentBookings = currentBookings + 1;
    await cls.save();

    // Send notification
    const notificationMessage =
      waitlistPosition > 0
        ? `You've been added to the waitlist for ${cls.name} (Position: ${waitlistPosition})`
        : `You've booked ${cls.name}`;

    await Notification.create({
      userId: req.user.id,
      type: 'class_booking',
      title: 'Class Booking Confirmed',
      message: notificationMessage,
      data: {
        classId: id,
        waitlistPosition,
      },
    });

    res.status(201).json({
      success: true,
      message: waitlistPosition > 0 ? 'Added to waitlist' : 'Class booked successfully',
      data: {
        booking,
        waitlistPosition,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel class booking
// @route   DELETE /api/classes/:id/cancel-booking
// @access  Private
exports.cancelClassBooking = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const memberIds = (await Member.find({ userId: req.user.id }).select('_id')).map((m) => m._id);

    const booking = await ClassBooking.findOne({
      classId: id,
      memberId: { $in: memberIds },
      status: 'booked',
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check 48-hour cancellation policy (assuming class is in future)
    const classDate = new Date(cls.schedule.date); // Assumes schedule has a date field
    const hoursUntilClass = (classDate - new Date()) / (1000 * 60 * 60);

    if (hoursUntilClass < 48) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel within 48 hours of class start',
      });
    }

    booking.status = 'canceled';
    booking.canceledAt = new Date();
    await booking.save();

    // Update class current bookings
    cls.currentBookings = Math.max(0, cls.currentBookings - 1);
    await cls.save();

    res.status(200).json({
      success: true,
      message: 'Booking canceled successfully',
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check-in to class
// @route   POST /api/classes/:id/check-in
// @access  Private
exports.classCheckIn = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const memberIds = (await Member.find({ userId: req.user.id }).select('_id')).map((m) => m._id);

    if (!memberIds.length) {
      return res.status(404).json({
        success: false,
        message: 'You are not booked for this class',
      });
    }

    const booking = await ClassBooking.findOne({
      classId: id,
      memberId: { $in: memberIds },
      status: 'booked',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'You are not booked for this class',
      });
    }

    const member = await Member.findById(booking.memberId);

    if (!member) {
      return res.status(404).json({ success: false, message: 'Booking member profile not found' });
    }

    booking.status = 'attended';
    booking.checkInAt = new Date();
    await booking.save();

    // Update member points
    member.points += 20;
    await member.save();

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        booking,
        pointsAwarded: 20,
        totalPoints: member.points,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update class
// @route   PATCH /api/classes/:id
// @access  Private (owner only)
exports.updateClass = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const gym = await Gym.findById(cls.gymId);
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this class',
      });
    }

    const allowedFields = [
      'name',
      'description',
      'duration',
      'maxCapacity',
      'schedule',
      'location',
      'difficulty',
      'equipment',
      'tags',
      'thumbnail',
    ];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedClass = await Class.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel class
// @route   POST /api/classes/:id/cancel
// @access  Private (owner only)
exports.cancelClass = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const cls = await Class.findById(id);
    if (!cls) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    const gym = await Gym.findById(cls.gymId);
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to cancel this class',
      });
    }

    cls.isCanceled = true;
    cls.cancelReason = reason || 'No reason provided';
    await cls.save();

    // Notify all booked members
    const bookings = await ClassBooking.find({
      classId: id,
      status: { $in: ['booked', 'attended'] },
    });

    for (const booking of bookings) {
      await Notification.create({
        userId: booking.memberId.userId,
        type: 'class_canceled',
        title: 'Class Canceled',
        message: `${cls.name} has been canceled. Reason: ${cls.cancelReason}`,
        data: {
          classId: id,
          reason: cls.cancelReason,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class canceled successfully',
      data: cls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
