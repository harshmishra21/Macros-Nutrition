import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new review
router.post('/', protect, async (req, res) => {
  const { productId, rating, text } = req.body;

  if (!rating || !text) {
    return res.status(400).json({ message: 'Rating and review content are required' });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const alreadyReviewed = await Review.findOne({ user: req.user._id, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Determine if verified purchase (user ordered this product before)
    const userOrders = await Order.find({ user: req.user._id, 'items.product': productId, paymentStatus: 'paid' });
    const verified = userOrders.length > 0;

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      text,
      verified,
      userName: req.user.name
    });

    await review.save();

    // Recalculate average rating for the product
    const reviews = await Review.find({ product: productId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    
    product.rating = Number((totalRating / reviews.length).toFixed(1));
    product.reviewCount = reviews.length;
    await product.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
