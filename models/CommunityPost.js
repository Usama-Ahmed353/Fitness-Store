const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const communityPostSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gymId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym' },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    media: [{ type: String }],
    tags: [{ type: String, trim: true, lowercase: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    shareCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'hidden', 'flagged'],
      default: 'active',
      index: true,
    },
  },
  { timestamps: true }
);

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ gymId: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
