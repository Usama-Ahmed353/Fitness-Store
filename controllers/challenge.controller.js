const { validationResult } = require('express-validator');
const Challenge = require('../models/Challenge');
const Member = require('../models/Member');

// @desc    Get challenges
// @route   GET /api/challenges
// @access  Public
exports.getChallenges = async (req, res) => {
  try {
    const { gymId, active = 'true', page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (gymId) filter.gymId = gymId;
    if (active === 'true') filter.isActive = true;

    const [challenges, total] = await Promise.all([
      Challenge.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Challenge.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: challenges,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's joined challenges
// @route   GET /api/challenges/me
// @access  Private
exports.getMyChallenges = async (req, res) => {
  try {
    const memberDocs = await Member.find({ userId: req.user.id }).select('_id');
    const memberIds = memberDocs.map((m) => m._id);

    if (memberIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const joined = await Challenge.find({
      'participants.memberId': { $in: memberIds },
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: joined });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join challenge
// @route   POST /api/challenges/:id/join
// @access  Private
exports.joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const member = await Member.findOne({
      userId: req.user.id,
      gymId: challenge.gymId,
      membershipStatus: 'active',
    });

    if (!member) {
      return res.status(400).json({
        success: false,
        message: 'You must have an active membership in this gym to join challenge',
      });
    }

    const alreadyJoined = challenge.participants.some((p) => p.memberId?.toString() === member._id.toString());
    if (alreadyJoined) {
      return res.status(400).json({ success: false, message: 'Already joined this challenge' });
    }

    challenge.participants.push({ memberId: member._id, progress: 0, isCompleted: false });
    await challenge.save();

    res.status(200).json({ success: true, message: 'Challenge joined', data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Leave challenge
// @route   DELETE /api/challenges/:id/leave
// @access  Private
exports.leaveChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const member = await Member.findOne({ userId: req.user.id, gymId: challenge.gymId });
    if (!member) {
      return res.status(400).json({ success: false, message: 'Member profile not found' });
    }

    challenge.participants = challenge.participants.filter(
      (p) => p.memberId?.toString() !== member._id.toString()
    );
    await challenge.save();

    res.status(200).json({ success: true, message: 'Challenge left', data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update challenge progress
// @route   PATCH /api/challenges/:id/progress
// @access  Private
exports.updateMyChallengeProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    const member = await Member.findOne({ userId: req.user.id, gymId: challenge.gymId });
    if (!member) {
      return res.status(400).json({ success: false, message: 'Member profile not found' });
    }

    const idx = challenge.participants.findIndex((p) => p.memberId?.toString() === member._id.toString());
    if (idx === -1) {
      return res.status(400).json({ success: false, message: 'Join challenge first' });
    }

    const safeProgress = Math.max(0, Number(progress || 0));
    challenge.participants[idx].progress = safeProgress;
    challenge.participants[idx].isCompleted = safeProgress >= challenge.goal;

    await challenge.save();
    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create challenge
// @route   POST /api/challenges
// @access  Private (admin, super_admin, gym_owner)
exports.createChallenge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const challenge = await Challenge.create(req.body);
    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update challenge
// @route   PATCH /api/challenges/:id
// @access  Private (admin, super_admin, gym_owner)
exports.updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete challenge
// @route   DELETE /api/challenges/:id
// @access  Private (admin, super_admin, gym_owner)
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, message: 'Challenge deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
