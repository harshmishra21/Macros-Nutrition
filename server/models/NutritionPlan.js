import mongoose from 'mongoose';

const NutritionPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  biometrics: {
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    goal: { type: String, required: true },
    activityLevel: { type: String, required: true }
  },
  macros: {
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    calories: { type: Number, required: true }
  },
  stack: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

const NutritionPlan = mongoose.model('NutritionPlan', NutritionPlanSchema);
export default NutritionPlan;
