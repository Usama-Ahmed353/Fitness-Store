const { validationResult } = require('express-validator');
const Trainer = require('../models/Trainer');
const User = require('../models/User');
const Gym = require('../models/Gym');
const Member = require('../models/Member');
const Notification = require('../models/Notification');

// Define a simple Session model (would need to be created separately)
const trainerSessionSchema = {
  _id: 'ObjectId',
  trainerId: 'ObjectId',
  memberId: 'ObjectId',
  scheduledDate: 'Date',
  duration: 'Number',
  status: 'String', // scheduled, completed, canceled
  notes: 'String',
  createdAt: 'Date',
};

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

    const member = await Member.findOne({ userId: req.user.id, gymId: trainer.gymId });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'You must be a member of this gym to book a session',
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

    if (
      !trainer.availability.days.includes(dayName) ||
      !trainer.availability.timeSlots.includes(timeSlot)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Selected time slot is not available',
      });
    }

    // Create session booking (simplified - would need a TrainerSession model)
    const session = {
      trainerId: id,
      memberId: member._id,
      scheduledDate: new Date(scheduledDate),
      duration,
      status: 'scheduled',
      notes,
      createdAt: new Date(),
    };

    // Send notification to trainer
    const user = await User.findById(req.user.id);
    await Notification.create({
      userId: trainer.userId,
      type: 'session_booking',
      title: 'New PT Session Booked',
      message: `${user.firstName} ${user.lastName} has booked a ${duration}-minute session on ${sessionDate.toDateString()}`,
      data: session,
    });

    res.status(201).json({
      success: true,
      message: 'PT session booked successfully',
      data: {
        ...session,
        trainerId: trainer._id,
        trainerName: (await User.findById(trainer.userId)).firstName,
        hourlyRate: trainer.hourlyRate,
        totalCost: (trainer.hourlyRate / 60) * duration,
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

    // Check if trainer already exists
    const existingTrainer = await Trainer.findOne({ userId, gymId });
    if (existingTrainer) {
      return res.status(400).json({
        success: false,
        message: 'Trainer already exists for this gym',
      });
    }

    const trainer = await Trainer.create({
      userId,
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

    // This would query a TrainerSession model (simplified response)
    const query = { trainerId: id };
    if (status) query.status = status;

    // Placeholder: would be replaced with actual TrainerSession queries
    res.status(200).json({
      success: true,
      data: [],
      message: 'Trainer sessions endpoint (implement TrainerSession model)',
      pagination: {
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
