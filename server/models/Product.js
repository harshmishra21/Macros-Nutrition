import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { 
    type: String, 
    enum: ['protein', 'pre-workout', 'creatine', 'vitamins', 'functional-foods', 'hydration'],
    required: true
  },
  goals: [{ 
    type: String, 
    enum: ['muscle', 'fatloss', 'performance', 'recovery', 'wellness'] 
  }],
  flavors: [{ 
    name: { type: String, required: true }, 
    colorHex: { type: String, required: true }, 
    kcal: { type: Number, default: 0 }, 
    inStock: { type: Boolean, default: true } 
  }],
  sizes: [{ 
    weight: { type: String, required: true }, 
    price: { type: Number, required: true }, 
    mrp: { type: Number, required: true } 
  }],
  description: { type: String, default: '' },
  shortDesc: { type: String, default: '' },
  macros: { 
    protein: { type: Number, default: 0 }, 
    carbs: { type: Number, default: 0 }, 
    fat: { type: Number, default: 0 }, 
    calories: { type: Number, default: 0 }, 
    servingSize: { type: String, default: '' } 
  },
  ingredients: { type: String, default: '' },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  tags: [{ type: String }],
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
