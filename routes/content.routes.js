const express = require('express');
const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');
const Content = require('../models/Content');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return true;
  }
  return false;
};

// Public: get a published content entry by key
router.get(
  '/:key',
  param('key').trim().notEmpty().withMessage('Content key is required'),
  async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const key = String(req.params.key || '').toLowerCase();
      const doc = await Content.findOne({ key, isPublished: true }).lean();

      if (!doc) {
        return res.status(404).json({ success: false, message: 'Content not found' });
      }

      res.status(200).json({
        success: true,
        data: {
          key: doc.key,
          title: doc.title,
          content: doc.content,
          updatedAt: doc.updatedAt,
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Admin: list content docs
router.get(
  '/',
  verifyToken,
  authorize('admin', 'super_admin'),
  query('published').optional().isBoolean(),
  async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const filter = {};
      if (typeof req.query.published !== 'undefined') {
        filter.isPublished = String(req.query.published) === 'true';
      }

      const docs = await Content.find(filter)
        .select('key title isPublished updatedAt createdAt')
        .sort({ updatedAt: -1 })
        .lean();

      res.status(200).json({ success: true, data: docs });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Admin: upsert content by key
router.put(
  '/:key',
  verifyToken,
  authorize('admin', 'super_admin'),
  param('key').trim().notEmpty().withMessage('Content key is required'),
  body('title').optional().isString(),
  body('content').notEmpty().withMessage('Content payload is required'),
  body('isPublished').optional().isBoolean(),
  async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const key = String(req.params.key || '').toLowerCase();
      const payload = {
        key,
        title: req.body.title || '',
        content: req.body.content,
        isPublished: typeof req.body.isPublished === 'boolean' ? req.body.isPublished : true,
        updatedBy: req.user.id,
      };

      const doc = await Content.findOneAndUpdate({ key }, payload, {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      });

      res.status(200).json({
        success: true,
        message: 'Content saved successfully',
        data: doc,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// Admin: delete content by key
router.delete(
  '/:key',
  verifyToken,
  authorize('admin', 'super_admin'),
  param('key').trim().notEmpty().withMessage('Content key is required'),
  async (req, res) => {
    try {
      if (handleValidationErrors(req, res)) return;

      const key = String(req.params.key || '').toLowerCase();
      const deleted = await Content.findOneAndDelete({ key });

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Content not found' });
      }

      res.status(200).json({ success: true, message: 'Content deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;