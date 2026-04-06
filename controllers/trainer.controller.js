const { validationResult } = require('express-validator');
const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Gym = require('../models/Gym');
const Member = require('../models/Member');
const Notification = require('../models/Notification');
const TrainerSession = require('../models/TrainerSession');

// @desc    Get all trainers with filters
// @route   GET /api/trainers
// @access  Public
exports.getTrainers = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { gymId, specialization, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (gymId) query.gymId = gymId;
    if (specialization) query.specializations = specialization;
    if (minPrice || maxPrice) {
      query.hourlyRate = {};
      if (minPrice) query.hourlyRate.$gte = parseFloat(minPrice);
      if (maxPrice) query.hourlyRate.$lte = parseFloat(maxPrice);
    }

    const trainers = await Trainer.find(query)
      .populate('userId', 'firstName lastName profilePhoto email phone')
      .populate('gymId', 'name slug')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trainer.countDocuments(query);

    res.status(200).json({
      success: true,
      data: trainers,
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

// @desc    Get single trainer
// @route   GET /api/trainers/:id
// @access  Public
exports.getTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id)
      .populate('userId', 'firstName lastName profilePhoto email phone bio')
      .populate('gymId', 'name slug address');

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    res.status(200).json({
      success: true,
      data: trainer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainer availability
// @route   GET /api/trainers/:id/availability
// @access  Public
exports.getTrainerAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    // Generate availability calendar
    const start = new Date(startDate || new Date());
    const end = new Date(endDate || new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000));

    const availability = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

      // Check if trainer is available on this day
      if (trainer.availability.days.includes(dayName)) {
        availability.push({
          date: new Date(d),
          dayName,
          timeSlots: trainer.availability.timeSlots || [
            '08:00',
            '09:00',
            '10:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
          ],
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        trainerId: id,
        hourlyRate: trainer.hourlyRate,
        availability,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Book PT session
// @route   POST /api/trainers/:id/book-session
// @access  Private
exports.bookTrainerSession = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { scheduledDate, duration = 60, notes } = req.body;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const memberProfiles = await Member.find({
      userId: req.user.id,
      membershipStatus: { $ne: 'canceled' },
    });

    let member = memberProfiles.find((m) => String(m.gymId) === String(trainer.gymId));

    if (!member) {
      member = await Member.create({
        userId: req.user.id,
        gymId: trainer.gymId,
        membershipPlan: 'base',
        membershipStatus: 'active',
        memberSince: new Date(),
      });
    }

    // Verify availability
    const sessionDate = new Date(scheduledDate);
    const dayName = sessionDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const timeSlot = sessionDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const normalizeTime = (value) => {
      if (!value) return '';

      const input = String(value).trim();
      const ampmMatch = input.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (ampmMatch) {
        let hh = parseInt(ampmMatch[1], 10);
        const mm = ampmMatch[2];
        const ampm = ampmMatch[3].toUpperCase();
        if (ampm === 'PM' && hh < 12) hh += 12;
        if (ampm === 'AM' && hh === 12) hh = 0;
        return `${String(hh).padStart(2, '0')}:${mm}`;
      }

      const hmMatch = input.match(/^(\d{1,2}):(\d{2})$/);
      if (hmMatch) {
        return `${String(parseInt(hmMatch[1], 10)).padStart(2, '0')}:${hmMatch[2]}`;
      }

      return input;
    };

    const availableDays = trainer.availability?.days || [];
    const availableSlots = (trainer.availability?.timeSlots || []).map(normalizeTime);
    const hasAvailabilityConfig = availableDays.length > 0 && availableSlots.length > 0;

    if (hasAvailabilityConfig) {
      const dayOk = availableDays.includes(dayName);
      const slotOk = availableSlots.includes(normalizeTime(timeSlot));
      if (!dayOk || !slotOk) {
        return res.status(400).json({
          success: false,
          message: 'Selected time slot is not available',
        });
      }
    }

    const totalCost = (trainer.hourlyRate / 60) * duration;

    const session = await TrainerSession.create({
      trainerId: id,
      memberId: member._id,
      gymId: trainer.gymId,
      scheduledDate: new Date(scheduledDate),
      duration,
      status: 'scheduled',
      notes: notes || '',
      totalCost,
    });

    // Send notification to trainer
    const user = await User.findById(req.user.id);
    await Notification.create({
      userId: trainer.userId,
      type: 'session_booking',
      title: 'New PT Session Booked',
      message: `${user.firstName} ${user.lastName} has booked a ${duration}-minute session on ${sessionDate.toDateString()}`,
      data: {
        sessionId: session._id,
        trainerId: trainer._id,
        memberId: member._id,
        scheduledDate: session.scheduledDate,
        duration: session.duration,
      },
    });

    const trainerUser = await User.findById(trainer.userId);

    await Notification.create({
      userId: req.user.id,
      type: 'session_booking',
      title: 'PT Session Confirmed',
      message: `Your session with ${trainerUser?.firstName || 'your trainer'} ${trainerUser?.lastName || ''}`.trim() + ` is booked for ${sessionDate.toDateString()}`,
      data: {
        sessionId: session._id,
        trainerId: trainer._id,
        scheduledDate: session.scheduledDate,
      },
    });

    res.status(201).json({
      success: true,
      message: 'PT session booked successfully',
      data: {
        _id: session._id,
        trainerId: trainer._id,
        trainerName: `${trainerUser?.firstName || ''} ${trainerUser?.lastName || ''}`.trim(),
        memberId: member._id,
        gymId: trainer.gymId,
        scheduledDate: session.scheduledDate,
        duration: session.duration,
        status: session.status,
        notes: session.notes,
        hourlyRate: trainer.hourlyRate,
        totalCost,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create trainer profile (gym owner)
// @route   POST /api/trainers
// @access  Private (gym_owner)
exports.createTrainer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      userId,
      gymId,
      firstName,
      lastName,
      email,
      password,
      phone,
      bio,
      specializations,
      certifications,
      yearsExperience,
      hourlyRate,
      languages,
      availability,
    } = req.body;

    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Verify ownership
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to create trainers for this gym',
      });
    }

    let resolvedUserId = userId;

    if (!resolvedUserId) {
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Provide userId or trainer account details (firstName, lastName, email, password)',
        });
      }

      const existingUser = await User.findOne({ email: String(email).toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists. Use their userId instead.',
        });
      }

      const createdUser = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        role: 'trainer',
      });
      resolvedUserId = createdUser._id;
    } else {
      const existing = await User.findById(resolvedUserId);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Trainer user not found' });
      }
      if (existing.role !== 'trainer') {
        existing.role = 'trainer';
        await existing.save();
      }
    }

    // Check if trainer already exists
    const existingTrainer = await Trainer.findOne({ userId: resolvedUserId, gymId });
    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: 'Trainer already exists for this gym',
      });
    }

    const trainer = await Trainer.create({
      userId: resolvedUserId,
      gymId,
      bio,
      specializations: specializations ? specializations.split(',').map((s) => s.trim()) : [],
      certifications: certifications ? certifications.split(',').map((c) => c.trim()) : [],
      yearsExperience,
      hourlyRate,
      languages: languages ? languages.split(',').map((l) => l.trim()) : [],
      availability: availability || { days: [], timeSlots: [] },
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Trainer profile created successfully',
      data: trainer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update trainer profile
// @route   PATCH /api/trainers/:id
// @access  Private (owner or self)
exports.updateTrainer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const gym = await Gym.findById(trainer.gymId);
    if (gym.ownerId.toString() !== req.user.id && trainer.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this trainer profile',
      });
    }

    const allowedFields = [
      'bio',
      'specializations',
      'certifications',
      'yearsExperience',
      'hourlyRate',
      'languages',
      'availability',
      'videoIntroUrl',
    ];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'specializations' || field === 'certifications' || field === 'languages') {
          updateData[field] = req.body[field].split(',').map((item) => item.trim());
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const updatedTrainer = await Trainer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Trainer profile updated successfully',
      data: updatedTrainer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get trainer sessions
// @route   GET /api/trainers/:id/sessions
// @access  Private
exports.getTrainerSessions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const trainer = await Trainer.findById(id);
    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer not found' });
    }

    const gym = await Gym.findById(trainer.gymId);
    const canAccess =
      req.user.id === trainer.userId.toString() ||
      ['admin', 'super_admin'].includes(req.user.role) ||
      (gym && gym.ownerId && gym.ownerId.toString() === req.user.id);

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view these sessions',
      });
    }

    const query = { trainerId: id };
    if (status) query.status = status;

    const sessions = await TrainerSession.find(query)
      .populate({ path: 'memberId', select: 'userId', populate: { path: 'userId', select: 'firstName lastName email profilePhoto' } })
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TrainerSession.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sessions,
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

// @desc    Get sessions for logged-in member
// @route   GET /api/trainers/sessions/my
// @access  Private
exports.getMyTrainerSessions = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const members = await Member.find({ userId: req.user.id }).select('_id');
    const memberIds = members.map((m) => m._id);

    if (!memberIds.length) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: 0,
        },
      });
    }

    const query = { memberId: { $in: memberIds } };
    if (status) query.status = status;

    const sessions = await TrainerSession.find(query)
      .populate({ path: 'trainerId', populate: [{ path: 'userId', select: 'firstName lastName profilePhoto' }, { path: 'gymId', select: 'name' }] })
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TrainerSession.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sessions,
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

// @desc    Get all trainer sessions for admin
// @route   GET /api/trainers/admin/sessions
// @access  Private (admin, super_admin)
exports.getAdminTrainerSessions = async (req, res, next) => {
  try {
    const { status, trainerId, gymId, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.status = status;
    if (trainerId) query.trainerId = trainerId;
    if (gymId) query.gymId = gymId;

    const sessions = await TrainerSession.find(query)
      .populate({ path: 'trainerId', select: 'userId gymId hourlyRate', populate: [{ path: 'userId', select: 'firstName lastName email' }, { path: 'gymId', select: 'name' }] })
      .populate({ path: 'memberId', select: 'userId', populate: { path: 'userId', select: 'firstName lastName email' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TrainerSession.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sessions,
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
