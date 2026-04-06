const express = require('express');
const { body, query, param } = require('express-validator');
const {
  getGyms,
  getGymBySlug,
  createGym,
  updateGym,
  uploadGymPhotos,
  getGymClasses,
  getGymTrainers,
  getGymReviews,
  deleteGym,
  getOwnerDashboard,
} = require('../controllers/gym.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { uploadGymPhotos: uploadGymPhotosMiddleware } = require('../config/cloudinary');

const router = express.Router();

// Public routes
router.get(
  '/',
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('lat').optional().isFloat(),
  query('lng').optional().isFloat(),
  query('radius').optional().isInt({ min: 1 }),
  getGyms
);

router.get('/owner/dashboard', verifyToken, authorize('gym_owner'), getOwnerDashboard);

router.get('/:slug', getGymBySlug);

router.get('/:id/classes', getGymClasses);

router.get('/:id/trainers', getGymTrainers);

router.get('/:id/reviews', getGymReviews);

// Protected routes
router.post(
  '/',
  verifyToken,
  authorize('gym_owner'),
  body('name').trim().notEmpty().withMessage('Gym name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  createGym
);

router.patch(
  '/:id',
  verifyToken,
  authorize('gym_owner'),
  body('name').optional().trim().notEmpty(),
  updateGym
);

router.put(
  '/:id/photos',
  verifyToken,
  authorize('gym_owner'),
  uploadGymPhotosMiddleware.array('photos', 10),
  uploadGymPhotos
);

router.delete('/:id', verifyToken, authorize('gym_owner'), deleteGym);

module.exports = router;
