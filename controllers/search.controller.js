const Gym = require('../models/Gym');
const Class = require('../models/Class');
const Trainer = require('../models/Trainer');
const User = require('../models/User');

// @desc    Full-text search
// @route   GET /api/search
// @access  Public
exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || req.query.query || '').trim();

    if (q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters',
      });
    }

    const searchRegex = new RegExp(q, 'i');

    // Search gyms
    const gyms = await Gym.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { 'address.city': searchRegex },
        { amenities: { $in: [searchRegex] } },
      ],
      isActive: true,
      isVerified: true,
    })
      .sort({ rating: -1 })
      .limit(10);

    // Search classes
    const classes = await Class.find({
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
      isActive: true,
      isCanceled: false,
    })
      .populate('instructorId', 'firstName lastName')
      .populate('gymId', 'name slug')
      .limit(10);

    // Search trainers
    const trainers = await Trainer.find({
      $or: [
        { bio: searchRegex },
        { specializations: { $in: [searchRegex] } },
        { certifications: { $in: [searchRegex] } },
      ],
      isActive: true,
    })
      .populate('userId', 'firstName lastName profilePhoto')
      .populate('gymId', 'name slug')
      .limit(10);

    // Search users (trainers/gym owners)
    const users = await User.find(
      {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ],
        role: { $in: ['trainer', 'gym_owner'] },
      }
    )
      .select('-password')
      .limit(5);

    const results = {
      gyms: gyms.map((gym) => ({
        type: 'gym',
        id: gym._id,
        name: gym.name,
        slug: gym.slug,
        logo: gym.logo,
        rating: gym.rating,
        location: gym.address.city,
      })),
      classes: classes.map((cls) => ({
        type: 'class',
        id: cls._id,
        name: cls.name,
        category: cls.category,
        difficulty: cls.difficulty,
        instructorName: cls.instructorId?.firstName,
        gym: cls.gymId?.name,
      })),
      trainers: trainers.map((trainer) => ({
        type: 'trainer',
        id: trainer._id,
        name: `${trainer.userId?.firstName} ${trainer.userId?.lastName}`,
        specializations: trainer.specializations,
        gym: trainer.gymId?.name,
        hourlyRate: trainer.hourlyRate,
        rating: trainer.rating,
      })),
      users: users.map((user) => ({
        type: 'user',
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        profilePhoto: user.profilePhoto,
      })),
    };

    const totalResults = gyms.length + classes.length + trainers.length + users.length;

    res.status(200).json({
      success: true,
      query: q,
      totalResults,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Advanced search with filters
// @route   GET /api/search/advanced
// @access  Public
exports.advancedSearch = async (req, res, next) => {
  try {
    const { type, q, filters } = req.query;

    if (!type || !['gym', 'class', 'trainer'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Valid types are: gym, class, trainer',
      });
    }

    const searchRegex = new RegExp(q || '', 'i');
    let query = {};
    let data = [];

    if (type === 'gym') {
      query = {
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { 'address.city': searchRegex },
        ],
        isActive: true,
        isVerified: true,
      };

      if (filters) {
        const filterObj = JSON.parse(filters);
        if (filterObj.city) query['address.city'] = new RegExp(filterObj.city, 'i');
        if (filterObj.minRating) query.rating = { $gte: filterObj.minRating };
        if (filterObj.amenities) query.amenities = { $in: filterObj.amenities };
      }

      data = await Gym.find(query).limit(50);
    } else if (type === 'class') {
      query = {
        $or: [{ name: searchRegex }, { description: searchRegex }, { category: searchRegex }],
        isActive: true,
        isCanceled: false,
      };

      if (filters) {
        const filterObj = JSON.parse(filters);
        if (filterObj.difficulty) query.difficulty = filterObj.difficulty;
        if (filterObj.category) query.category = filterObj.category;
        if (filterObj.gymId) query.gymId = filterObj.gymId;
      }

      data = await Class.find(query)
        .populate('instructorId', 'firstName lastName')
        .populate('gymId', 'name slug')
        .limit(50);
    } else if (type === 'trainer') {
      query = {
        $or: [{ bio: searchRegex }, { specializations: { $in: [searchRegex] } }],
        isActive: true,
      };

      if (filters) {
        const filterObj = JSON.parse(filters);
        if (filterObj.minPrice || filterObj.maxPrice) {
          query.hourlyRate = {};
          if (filterObj.minPrice) query.hourlyRate.$gte = filterObj.minPrice;
          if (filterObj.maxPrice) query.hourlyRate.$lte = filterObj.maxPrice;
        }
        if (filterObj.specialization)
          query.specializations = { $in: [filterObj.specialization] };
        if (filterObj.gymId) query.gymId = filterObj.gymId;
      }

      data = await Trainer.find(query)
        .populate('userId', 'firstName lastName profilePhoto')
        .populate('gymId', 'name slug')
        .limit(50);
    }

    res.status(200).json({
      success: true,
      type,
      query: q,
      totalResults: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
