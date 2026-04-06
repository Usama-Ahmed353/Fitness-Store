const express = require('express');
const { body, param } = require('express-validator');
const {
  getChallenges,
  getMyChallenges,
  joinChallenge,
  leaveChallenge,
  updateMyChallengeProgress,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} = require('../controllers/challenge.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

router.get('/', getChallenges);
router.get('/me', verifyToken, getMyChallenges);

router.post(
  '/',
  verifyToken,
  authorize('admin', 'super_admin', 'gym_owner'),
  body('gymId').notEmpty().withMessage('Gym ID is required'),
  body('title').notEmpty().withMessage('Title is required'),
  body('type').isIn(['check_in', 'classes', 'weight_loss', 'custom']).withMessage('Invalid type'),
  body('goal').isNumeric().withMessage('Goal must be numeric'),
  body('startDate').isISO8601().withMessage('Valid startDate is required'),
  body('endDate').isISO8601().withMessage('Valid endDate is required'),
  createChallenge
);

router.post('/:id/join', verifyToken, param('id').isMongoId(), joinChallenge);
router.delete('/:id/leave', verifyToken, param('id').isMongoId(), leaveChallenge);
router.patch(
  '/:id/progress',
  verifyToken,
  param('id').isMongoId(),
  body('progress').isNumeric().withMessage('Progress must be numeric'),
  updateMyChallengeProgress
);

router.patch(
  '/:id',
  verifyToken,
  authorize('admin', 'super_admin', 'gym_owner'),
  param('id').isMongoId(),
  updateChallenge
);
router.delete(
  '/:id',
  verifyToken,
  authorize('admin', 'super_admin', 'gym_owner'),
  param('id').isMongoId(),
  deleteChallenge
);

module.exports = router;
