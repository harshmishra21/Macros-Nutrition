import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  verified: { type: Boolean, default: false },
  userName: { type: String, required: true }
}, { timestamps: true });

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
