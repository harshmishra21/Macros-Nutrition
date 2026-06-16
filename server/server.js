import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import aiRoutes from './routes/ai.js';
import stackRoutes from './routes/stack.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const app = express();
let PORT = process.env.PORT || 5050;
if (PORT === '5000' || PORT === 5000) {
  PORT = 5050;
}

// CORS setup — reads allowed origins from env variable for production
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : [])
];

const localOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (localOriginRegex.test(origin)) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true
}));

app.use(express.json());

// Custom cookie-parser middleware
app.use((req, res, next) => {
  req.cookies = {};
  if (req.headers.cookie) {
    req.headers.cookie.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        req.cookies[parts[0].trim()] = decodeURIComponent(parts.slice(1).join('=').trim());
      }
    });
  }
  next();
});

// Routes registration
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/stack', stackRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Base route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Connect to database and start server
const startServer = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/macros-nutrition';
    try {
      console.log(`Connecting to MongoDB...`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB Connected successfully.');
    } catch (dbError) {
      if (process.env.MONGO_URI && process.env.MONGO_URI !== 'mongodb://127.0.0.1:27017/macros-nutrition') {
        console.warn('Failed to connect to primary MONGO_URI (possibly due to IP whitelisting). Falling back to local MongoDB...');
        mongoUri = 'mongodb://127.0.0.1:27017/macros-nutrition';
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
        console.log('MongoDB Connected successfully to local database fallback.');
      } else {
        throw dbError;
      }
    }

    // Auto-seed database if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found in DB. Auto-seeding initial products...');
      // Dynamic import to prevent circular or top-level file execution issues
      const { default: fs } = await import('fs');
      const { default: path } = await import('path');
      const seederPath = path.resolve('seeder.js');
      
      // Let's spawn or run the seeder code in-process
      // To run in-process, we can just run the query directly.
      // We already wrote seeder.js, so let's import the product list and insert it.
      // But since we want to be safe and simple, let's just trigger it or run a simple insert.
      // Let's copy the product seeding logic from seeder.js here for absolute bullet-proof seeding on start!
      const defaultProducts = [
        {
          name: 'WHEY ISOLATE - ULTRA PURE',
          slug: 'whey-isolate',
          category: 'protein',
          goals: ['muscle', 'performance', 'recovery'],
          flavors: [
            { name: 'Dark Chocolate', colorHex: '#8B4513', kcal: 130, inStock: true },
            { name: 'Strawberry', colorHex: '#FF69B4', kcal: 125, inStock: true },
            { name: 'Mango', colorHex: '#F5A623', kcal: 128, inStock: true },
            { name: 'Vanilla', colorHex: '#F0E6C8', inStock: true },
            { name: 'Pomegranate', colorHex: '#C71585', kcal: 120, inStock: true }
          ],
          sizes: [
            { weight: '1 kg', price: 1899, mrp: 2499 },
            { weight: '2 kg', price: 3499, mrp: 4499 }
          ],
          shortDesc: 'Cold-processed cross-flow microfiltered whey protein isolate. Zero fillers, maximum absorption.',
          description: 'Our premium Whey Isolate is engineered to deliver 27g of pure protein per serving. Fast-acting and incredibly clean, it accelerates recovery and aids muscle hypertrophy. Zero amino spiking, certified free of heavy metals.',
          macros: { protein: 27, carbs: 2, fat: 1, calories: 130, servingSize: '33g' },
          ingredients: 'Whey Protein Isolate, Cocoa Powder, Natural and Artificial Flavors, Soy Lecithin, Sucralose.',
          rating: 4.8,
          reviewCount: 147,
          salesCount: 850,
          featured: true,
          tags: ['BESTSELLER', 'RAPID RECOVERY', 'ISOLATE']
        },
        {
          name: 'AMPLIFIED PRE-WORKOUT',
          slug: 'pre-workout',
          category: 'pre-workout',
          goals: ['performance', 'muscle'],
          flavors: [
            { name: 'Blue Raspberry', colorHex: '#00BFFF', kcal: 10, inStock: true },
            { name: 'Watermelon Rush', colorHex: '#FF1493', kcal: 10, inStock: true }
          ],
          sizes: [
            { weight: '300 g', price: 1499, mrp: 1999 }
          ],
          shortDesc: 'Clinical doses of L-Citrulline, Beta-Alanine, and Caffeine for extreme energy, pump, and laser focus.',
          description: 'Power your workouts with explosive energy and extreme vascularity. Amplified Pre-Workout features 6g of L-Citrulline, 3.2g of Beta-Alanine, and 300mg of Caffeine to push your training limits.',
          macros: { protein: 0, carbs: 2, fat: 0, calories: 10, servingSize: '12g' },
          ingredients: 'L-Citrulline, Beta-Alanine, Creatine Monohydrate, Caffeine Anhydrous, L-Theanine, Natural Flavors, Citric Acid, Sucralose.',
          rating: 4.7,
          reviewCount: 96,
          salesCount: 520,
          featured: true,
          tags: ['HIGH STIM', 'EXTREME PUMPS']
        },
        {
          name: 'CREATINE MONOHYDRATE - MICRONIZED',
          slug: 'creatine',
          category: 'creatine',
          goals: ['muscle', 'performance'],
          flavors: [
            { name: 'Unflavored', colorHex: '#A8B4C0', kcal: 0, inStock: true }
          ],
          sizes: [
            { weight: '250 g', price: 849, mrp: 1199 }
          ],
          shortDesc: '100% pure micronized creatine monohydrate to enhance ATP synthesis, muscle strength, and power output.',
          description: 'Increase muscle cell volume, endurance, and power outputs. Our micronized creatine mixes effortlessly and absorbs rapidly. Third-party lab tested for purity.',
          macros: { protein: 0, carbs: 0, fat: 0, calories: 0, servingSize: '3g' },
          ingredients: '100% Micronized Creatine Monohydrate.',
          rating: 4.9,
          reviewCount: 215,
          salesCount: 1200,
          featured: true,
          tags: ['SCIENCE-BACKED', 'STRENGTH']
        },
        {
          name: 'PLANT PROTEIN - AMINO FUSION',
          slug: 'plant-protein',
          category: 'protein',
          goals: ['fatloss', 'wellness'],
          flavors: [
            { name: 'Cafe Mocha', colorHex: '#5C4033', kcal: 120, inStock: true },
            { name: 'Vanilla Caramel', colorHex: '#C5B358', kcal: 118, inStock: true }
          ],
          sizes: [
            { weight: '1 kg', price: 1799, mrp: 2399 }
          ],
          shortDesc: 'Pea and organic brown rice protein blend. Organic greens extract, dairy-free, hypoallergenic.',
          description: 'A premium hypoallergenic vegan protein blend providing 24g of complete protein with all essential amino acids. Enhanced with digestive enzymes for perfect gut comfort.',
          macros: { protein: 24, carbs: 3, fat: 2, calories: 120, servingSize: '35g' },
          ingredients: 'Pea Protein Isolate, Brown Rice Protein, Organic Greens Blend, Digestive Enzymes, Natural Sweetener (Stevia).',
          rating: 4.5,
          reviewCount: 64,
          salesCount: 310,
          featured: false,
          tags: ['VEGAN', 'CLEAN LABEL']
        },
        {
          name: 'HYDRATION ELECTROLYTES',
          slug: 'electrolytes',
          category: 'hydration',
          goals: ['performance', 'recovery', 'fatloss'],
          flavors: [
            { name: 'Lively Lemon', colorHex: '#FFE4E1', kcal: 5, inStock: true },
            { name: 'Orange Zest', colorHex: '#FF8C00', kcal: 5, inStock: true }
          ],
          sizes: [
            { weight: '200 g', price: 699, mrp: 999 }
          ],
          shortDesc: 'Rapid hydration complex containing Sodium, Potassium, Magnesium, and Coconut water powder.',
          description: 'Keep muscle cramps at bay and maintain cellular hydration. Formulated with key trace minerals and zero added sugars, ideal for long runs and sweaty training sessions.',
          macros: { protein: 0, carbs: 1, fat: 0, calories: 5, servingSize: '6g' },
          ingredients: 'Sodium Chloride, Potassium Chloride, Magnesium Citrate, Calcium Carbonate, Coconut Water Powder, Citric Acid, Stevia.',
          rating: 4.6,
          reviewCount: 42,
          salesCount: 280,
          featured: false,
          tags: ['REHYDRATE', 'ZERO SUGAR']
        },
        {
          name: 'OMEGA-3 ULTRA EPA/DHA',
          slug: 'omega-3-epa-dha',
          category: 'vitamins',
          goals: ['recovery', 'wellness', 'fatloss'],
          flavors: [
            { name: 'Softgel', colorHex: '#FFD700', kcal: 10, inStock: true }
          ],
          sizes: [
            { weight: '60 caps', price: 999, mrp: 1399 }
          ],
          shortDesc: 'Double strength molecularly distilled fish oil capsule. Promotes joint recovery and cardiac health.',
          description: 'Contains high concentration EPA (550mg) and DHA (350mg) per softgel. Enteric coated to eliminate fishy aftertaste. Supports brain health, vision, and joint flexibility.',
          macros: { protein: 0, carbs: 0, fat: 1, calories: 10, servingSize: '1 Softgel' },
          ingredients: 'Fish Oil Concentrate (Sardine/Anchovy), Gelatin Shell, Glycerin, Purified Water.',
          rating: 4.8,
          reviewCount: 78,
          salesCount: 430,
          featured: false,
          tags: ['JOINT HEALTH', 'BRAIN FUEL']
        },
        {
          name: 'WHEY CONCENTRATE - PREMIUM',
          slug: 'whey-concentrate',
          category: 'protein',
          goals: ['recovery', 'muscle'],
          flavors: [
            { name: 'Rich Chocolate', colorHex: '#4A2F13', kcal: 140, inStock: true },
            { name: 'Vanilla Cream', colorHex: '#FFFDD0', kcal: 138, inStock: true }
          ],
          sizes: [
            { weight: '1 kg', price: 1499, mrp: 1999 },
            { weight: '2 kg', price: 2799, mrp: 3799 }
          ],
          shortDesc: 'High-quality whey protein concentrate providing 24g protein per scoop. Delicious creamy texture.',
          description: 'Perfect daily protein source for muscle maintenance and recovery. Rich in BCAAs and naturally occurring immunoglobulins to bolster immune health.',
          macros: { protein: 24, carbs: 3, fat: 2, calories: 140, servingSize: '36g' },
          ingredients: 'Whey Protein Concentrate, Alkalized Cocoa, Natural Flavors, Xanthan Gum, Sucralose.',
          rating: 4.7,
          reviewCount: 112,
          salesCount: 680,
          featured: false,
          tags: ['CREAMY', 'DAILY PROTEIN']
        },
        {
          name: 'EAA MATRIX - INTRA-WORKOUT',
          slug: 'eaa-complex',
          category: 'protein',
          goals: ['recovery', 'performance'],
          flavors: [
            { name: 'Green Apple', colorHex: '#32CD32', kcal: 0, inStock: true },
            { name: 'Pineapple Slice', colorHex: '#FFD700', kcal: 0, inStock: true }
          ],
          sizes: [
            { weight: '300 g', price: 1399, mrp: 1899 }
          ],
          shortDesc: 'All 9 Essential Amino Acids (EAAs) with Electrolyte Hydration blend for performance endurance.',
          description: 'Sip during workouts to prevent muscle breakdown, speed up recovery, and maintain optimal hydration. Features 8g total EAAs per scoop.',
          macros: { protein: 8, carbs: 0, fat: 0, calories: 0, servingSize: '10g' },
          ingredients: 'L-Leucine, L-Isoleucine, L-Valine, L-Lysine, L-Threonine, Electrolyte Blend, Citric Acid, Flavoring, Sucralose.',
          rating: 4.6,
          reviewCount: 39,
          salesCount: 190,
          featured: false,
          tags: ['INTRA WORKOUT', 'MUSCLE RESCUE']
        },
        {
          name: 'DAILY SPORT MULTIVITAMIN',
          slug: 'multivitamin',
          category: 'vitamins',
          goals: ['wellness', 'recovery'],
          flavors: [
            { name: 'Tablet', colorHex: '#E6E6FA', kcal: 0, inStock: true }
          ],
          sizes: [
            { weight: '60 Tabs', price: 799, mrp: 1099 }
          ],
          shortDesc: '37 active ingredients. Sports multivitamin with digestive enzymes and antioxidant botanical blends.',
          description: 'Engineered specifically for active individuals. Fills micronutrient gaps, boots immunity, improves daily energy metabolism, and reduces oxidative stress.',
          macros: { protein: 0, carbs: 0, fat: 0, calories: 0, servingSize: '1 Tablet' },
          ingredients: 'Vitamins A, C, D, E, B-Complex, Zinc, Magnesium, CoQ10, Ginseng Extract, Grape Seed Extract.',
          rating: 4.8,
          reviewCount: 104,
          salesCount: 540,
          featured: false,
          tags: ['IMMUNE SUPPORT', 'MICRO-FUEL']
        },
        {
          name: 'ORGANIC PROTEIN OATS',
          slug: 'protein-oats',
          category: 'functional-foods',
          goals: ['wellness', 'muscle'],
          flavors: [
            { name: 'Banana Nut', colorHex: '#DEB887', kcal: 220, inStock: true },
            { name: 'Chocolate Flakes', colorHex: '#3D2314', kcal: 225, inStock: true }
          ],
          sizes: [
            { weight: '1 kg', price: 649, mrp: 899 }
          ],
          shortDesc: 'Whole grain rolled oats infused with premium whey protein isolate and chia seeds.',
          description: 'The ultimate fitness breakfast. Combines complex slow-release carbohydrates from organic oats with fast-acting clean whey isolate. 20g protein per bowl.',
          macros: { protein: 20, carbs: 32, fat: 4, calories: 220, servingSize: '60g' },
          ingredients: 'Organic Rolled Oats, Whey Protein Isolate, Chia Seeds, Organic Banana Powder, Sucralose.',
          rating: 4.7,
          reviewCount: 55,
          salesCount: 400,
          featured: false,
          tags: ['BREAKFAST OF CHAMPIONS', 'HIGH FIBER']
        },
        {
          name: 'BCAA MATRIX 2:1:1',
          slug: 'bcaa-matrix',
          category: 'protein',
          goals: ['muscle', 'performance', 'recovery'],
          flavors: [
            { name: 'Tangy Orange', colorHex: '#FFA500', kcal: 0, inStock: true },
            { name: 'Cola Fizz', colorHex: '#4E2C1A', kcal: 0, inStock: true }
          ],
          sizes: [
            { weight: '250 g', price: 1299, mrp: 1699 }
          ],
          shortDesc: 'Pure Branched Chain Amino Acids in the proven 2:1:1 ratio to trigger anabolic recovery.',
          description: 'Accelerate intra-workout healing and reduce muscle soreness. Each serving delivers 5g of pure BCAAs to preserve lean muscle tissue.',
          macros: { protein: 5, carbs: 0, fat: 0, calories: 0, servingSize: '8g' },
          ingredients: 'L-Leucine, L-Isoleucine, L-Valine, Malic Acid, Sucralose, Silicon Dioxide.',
          rating: 4.6,
          reviewCount: 48,
          salesCount: 220,
          featured: false,
          tags: ['RECOVERY', 'ANTI CATABOLIC']
        }
      ];

      await Product.insertMany(defaultProducts);
      console.log('Database successfully auto-seeded!');

      // Make sure admin exists too
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash('admin12345', salt);
        await User.create({
          name: 'Admin Coach',
          email: 'admin@macros.in',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('Created default admin: admin@macros.in / admin12345');
      }
    }

    app.listen(PORT, () => {
      console.log(`Server executing on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error: ', error);
  }
};

startServer();
