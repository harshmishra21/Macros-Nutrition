import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

const goalStacks = {
  muscle: ['whey-isolate', 'creatine', 'bcaa-matrix'],
  fatloss: ['plant-protein', 'electrolytes', 'omega-3-epa-dha'],
  performance: ['pre-workout', 'whey-isolate', 'electrolytes'],
  recovery: ['whey-concentrate', 'eaa-complex', 'omega-3-epa-dha'],
  wellness: ['multivitamin', 'omega-3-epa-dha', 'protein-oats']
};

// GET stack recommendations by goal
router.get('/:goal', async (req, res) => {
  const { goal } = req.params;

  const slugs = goalStacks[goal];
  if (!slugs) {
    return res.status(400).json({ message: 'Invalid goal identifier' });
  }

  try {
    const products = await Product.find({ slug: { $in: slugs } });
    
    // Sort products in the exact order requested in goalStacks
    const sortedProducts = slugs.map(slug => products.find(p => p.slug === slug)).filter(Boolean);

    res.json(sortedProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
