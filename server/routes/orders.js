import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';

const router = express.Router();

// Create new order
router.post('/', protect, async (req, res) => {
  const { items, shippingAddress, paymentMethod, paymentId } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No items in order' });
  }

  try {
    // Verify items and prices from database to prevent price manipulation
    let calculatedTotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }

      // Find price matching the selected size
      const sizeConfig = dbProduct.sizes.find(s => s.weight === item.size);
      const price = sizeConfig ? sizeConfig.price : dbProduct.sizes[0].price;

      calculatedTotal += price * item.quantity;
      verifiedItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        flavor: item.flavor,
        size: item.size,
        quantity: item.quantity,
        price
      });
      
      // Update sales count
      dbProduct.salesCount += item.quantity;
      await dbProduct.save();
    }

    const order = new Order({
      user: req.user._id,
      items: verifiedItems,
      total: calculatedTotal,
      shippingAddress,
      paymentMethod,
      paymentId,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending'
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged-in user orders
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  const { status, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
