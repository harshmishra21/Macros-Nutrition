import mongoose from 'mongoose';

const MacroLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  calories: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const MacroLog = mongoose.model('MacroLog', MacroLogSchema);
export default MacroLog;
