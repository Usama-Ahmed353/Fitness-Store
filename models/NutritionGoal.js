const mongoose = require('mongoose');

const nutritionGoalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    calories: { type: Number, default: 2200 },
    protein: { type: Number, default: 150 },
    carbs: { type: Number, default: 220 },
    fat: { type: Number, default: 70 },
    objective: {
      type: String,
      enum: ['maintain', 'cut', 'bulk'],
      default: 'maintain',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NutritionGoal', nutritionGoalSchema);
