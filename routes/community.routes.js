const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const {
  getFeed,
  createPost,
  toggleLike,
  addComment,
  sharePost,
  deleteOwnPost,
  getModerationFeed,
  moderatePost,
} = require('../controllers/community.controller');

const router = express.Router();

router.get('/posts', getFeed);
router.post('/posts', verifyToken, createPost);
router.post('/posts/:id/like', verifyToken, toggleLike);
router.post('/posts/:id/comment', verifyToken, addComment);
router.post('/posts/:id/share', verifyToken, sharePost);
router.delete('/posts/:id', verifyToken, deleteOwnPost);

router.get('/admin/posts', verifyToken, authorize('admin', 'super_admin'), getModerationFeed);
router.patch('/admin/posts/:id/moderate', verifyToken, authorize('admin', 'super_admin'), moderatePost);

module.exports = router;
