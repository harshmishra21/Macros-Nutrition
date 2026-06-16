import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// GET all products with filtering, search, sorting and pagination
router.get('/', async (req, res) => {
  const { category, goal, minPrice, maxPrice, search, sort, page = 1, limit = 12 } = req.query;

  const query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (goal) {
    query.goals = { $in: goal.split(',') };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  } else {
    // If not matching query, we can query inside sizes which is sizes.price
    query['sizes.price'] = { $exists: true };
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const sortMap = {
    'featured': { featured: -1 },
    'bestsellers': { salesCount: -1 },
    'price-asc': { 'sizes.price': 1 },
    'price-desc': { 'sizes.price': -1 },
    'newest': { createdAt: -1 },
  };

  try {
    const activeSort = sortMap[sort] || { featured: -1 };
    
    // First, let's query the products
    const products = await Product.find(query)
      .sort(activeSort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      pages: Math.ceil(total / Number(limit)),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single product by ID or Slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    let product;
    // Check if valid ObjectId
    if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(req.params.idOrSlug);
    } else {
      product = await Product.findOne({ slug: req.params.idOrSlug });
    }

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create product (admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update product (admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE product (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
