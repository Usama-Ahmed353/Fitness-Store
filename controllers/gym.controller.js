const { validationResult } = require('express-validator');
const Gym = require('../models/Gym');
const Review = require('../models/Review');
const Class = require('../models/Class');
const Trainer = require('../models/Trainer');

// @desc    Get all gyms with filters and geosearch
// @route   GET /api/gyms
// @access  Public
exports.getGyms = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lat, lng, radius = 25, page = 1, limit = 10, city, amenities, rating } = req.query;
    const skip = (page - 1) * limit;

    let query = { isActive: true, isVerified: true };

    // City filter
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }

    // Amenities filter
    if (amenities) {
      const amenityList = amenities.split(',').map((a) => a.trim());
      query.amenities = { $in: amenityList };
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    let gyms;
    let total;

    // Geosearch if lat/lng provided
    if (lat && lng) {
      const radiusInRadians = (radius * 1.60934) / 6371; // Convert miles to radians

      gyms = await Gym.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)],
            },
            distanceField: 'distance',
            maxDistance: radiusInRadians,
            spherical: true,
          },
        },
        { $match: query },
        { $skip: skip },
        { $limit: parseInt(limit) },
      ]);

      total = await Gym.countDocuments(query);
    } else {
      gyms = await Gym.find(query)
        .populate('subscriptionId', 'plan status')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      total = await Gym.countDocuments(query);
    }

    res.status(200).json({
      success: true,
      data: gyms,
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

// @desc    Get gym by slug with details
// @route   GET /api/gyms/:slug
// @access  Public
exports.getGymBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const gym = await Gym.findOne({ slug, isActive: true })
      .populate('ownerId', 'firstName lastName email phone')
      .populate('subscriptionId');

    if (!gym) {
      return res.status(404).json({
        success: false,
        message: 'Gym not found',
      });
    }

    // Get reviews
    const reviews = await Review.find({
      targetType: 'gym',
      targetId: gym._id,
      isApproved: true,
    })
      .populate('authorId', 'firstName lastName profilePhoto')
      .limit(10);

    // Get classes
    const classes = await Class.find({ gymId: gym._id, isActive: true, isCanceled: false })
      .populate('instructorId', 'firstName lastName')
      .limit(15);

    // Get trainers
    const trainers = await Trainer.find({ gymId: gym._id, isActive: true })
      .populate('userId', 'firstName lastName profilePhoto')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...gym.toObject(),
        reviews,
        classes,
        trainers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new gym
// @route   POST /api/gyms
// @access  Private (gym_owner)
exports.createGym = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, address, phone, email, website, description, amenities, openingHours } = req.body;

    // Check if gym already exists
    const existingGym = await Gym.findOne({ email });
    if (existingGym) {
      return res.status(400).json({
        success: false,
        message: 'Gym with this email already exists',
      });
    }

    const gym = await Gym.create({
      name,
      ownerId: req.user.id,
      address,
      phone,
      email,
      website,
      description,
      amenities: amenities ? amenities.split(',').map((a) => a.trim()) : [],
      openingHours,
      isActive: true,
      isVerified: false,
    });

    res.status(201).json({
      success: true,
      message: 'Gym created successfully. Awaiting verification.',
      data: gym,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update gym
// @route   PATCH /api/gyms/:id
// @access  Private (owner only)
exports.updateGym = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Check ownership
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this gym',
      });
    }

    // Update allowed fields
    const allowedFields = ['name', 'address', 'phone', 'email', 'website', 'description', 'openingHours'];
    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (req.body.amenities) {
      updateData.amenities = req.body.amenities.split(',').map((a) => a.trim());
    }

    const updatedGym = await Gym.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Gym updated successfully',
      data: updatedGym,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload gym photos
// @route   PUT /api/gyms/:id/photos
// @access  Private (owner only)
exports.uploadGymPhotos = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Check ownership
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this gym',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Get secure URLs from Cloudinary (multer-storage-cloudinary adds path property)
    const photoUrls = req.files.map((file) => file.path);

    // Determine which is logo/cover and which are gallery photos
    gym.logo = photoUrls[0];
    if (req.body.setCover === '1' && photoUrls[1]) {
      gym.coverPhoto = photoUrls[1];
      gym.photos = photoUrls.slice(2);
    } else {
      gym.photos = photoUrls.slice(1);
    }

    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Photos uploaded successfully',
      data: gym,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get gym's classes
// @route   GET /api/gyms/:id/classes
// @access  Public
exports.getGymClasses = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    const classes = await Class.find({ gymId: id, isActive: true, isCanceled: false })
      .populate('instructorId', 'firstName lastName rating')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ 'schedule.time': 1 });

    const total = await Class.countDocuments({ gymId: id, isActive: true, isCanceled: false });

    res.status(200).json({
      success: true,
      data: classes,
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

// @desc    Get gym's trainers
// @route   GET /api/gyms/:id/trainers
// @access  Public
exports.getGymTrainers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    const trainers = await Trainer.find({ gymId: id, isActive: true })
      .populate('userId', 'firstName lastName profilePhoto email')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Trainer.countDocuments({ gymId: id, isActive: true });

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

// @desc    Get gym's reviews
// @route   GET /api/gyms/:id/reviews
// @access  Public
exports.getGymReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    const reviews = await Review.find({
      targetType: 'gym',
      targetId: id,
      isApproved: true,
    })
      .populate('authorId', 'firstName lastName profilePhoto')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      targetType: 'gym',
      targetId: id,
      isApproved: true,
    });

    res.status(200).json({
      success: true,
      data: reviews,
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

// @desc    Delete gym
// @route   DELETE /api/gyms/:id
// @access  Private (owner only)
exports.deleteGym = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gym = await Gym.findById(id);
    if (!gym) {
      return res.status(404).json({ success: false, message: 'Gym not found' });
    }

    // Check ownership
    if (gym.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this gym',
      });
    }

    gym.isActive = false;
    await gym.save();

    res.status(200).json({
      success: true,
      message: 'Gym deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
