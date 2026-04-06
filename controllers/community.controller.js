const CommunityPost = require('../models/CommunityPost');

exports.getFeed = async (req, res) => {
  try {
    const { page = 1, limit = 20, gymId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = { status: 'active' };
    if (gymId) filter.gymId = gymId;

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .populate('authorId', 'firstName lastName profilePhoto')
        .populate('comments.userId', 'firstName lastName profilePhoto')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
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

exports.createPost = async (req, res) => {
  try {
    const { content, media = [], tags = [], gymId } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: 'Post content is required' });
    }

    const post = await CommunityPost.create({
      authorId: req.user.id,
      gymId: gymId || undefined,
      content: String(content).trim(),
      media,
      tags,
    });

    const populated = await CommunityPost.findById(post._id).populate('authorId', 'firstName lastName profilePhoto').lean();

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post || post.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const uid = req.user.id.toString();
    const already = post.likes.some((u) => u.toString() === uid);

    if (already) post.likes = post.likes.filter((u) => u.toString() !== uid);
    else post.likes.push(req.user.id);

    await post.save();

    res.status(200).json({ success: true, data: { liked: !already, likesCount: post.likes.length } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post || post.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({ userId: req.user.id, content: String(content).trim() });
    await post.save();

    const populated = await CommunityPost.findById(post._id)
      .populate('comments.userId', 'firstName lastName profilePhoto')
      .lean();

    res.status(201).json({ success: true, data: populated.comments[populated.comments.length - 1] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sharePost = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: { shareCount: post.shareCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOwnPost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.authorId.toString() !== req.user.id && !['admin', 'super_admin'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Not allowed to delete this post' });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getModerationFeed = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const filter = {};
    if (status) filter.status = status;

    const [posts, total] = await Promise.all([
      CommunityPost.find(filter)
        .populate('authorId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      CommunityPost.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
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

exports.moderatePost = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'hidden', 'flagged'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid moderation status' });
    }

    const post = await CommunityPost.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
