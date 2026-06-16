import mongoose from 'mongoose';

const WeightLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weightKg: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const WeightLog = mongoose.model('WeightLog', WeightLogSchema);
export default WeightLog;
