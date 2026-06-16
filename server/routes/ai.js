import express from 'express';
import rateLimit from 'express-rate-limit';
import { callClaude, callClaudeChat } from '../utils/claudeProxy.js';
import Product from '../models/Product.js';
import NutritionPlan from '../models/NutritionPlan.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Rate limiting on AI endpoints (max 15 requests per 15 minutes)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 15,
  message: { message: 'Too many requests to MACROS AI. Please try again in 15 minutes.' }
});

// Calculate Macros & Recommendations
router.post('/nutrition', aiLimiter, async (req, res) => {
  const { age, gender, heightCm, weightKg, goal, activityLevel } = req.body;

  if (!age || !gender || !heightCm || !weightKg || !goal || !activityLevel) {
    return res.status(400).json({ message: 'All biometrics are required for calculations' });
  }

  const systemPrompt = `You are MACROS AI, an elite sports nutrition expert for Indian athletes. 
Calculate precise daily calorie targets (TDEE) and macronutrients (Protein, Carbs, Fat in grams) based on the user biometrics.
Recommend a supplement stack of 3 products (use slugs: whey-isolate, pre-workout, creatine, plant-protein, electrolytes, omega-3-epa-dha, whey-concentrate, eaa-complex, multivitamin, protein-oats).
Always respond in JSON format ONLY, matching this schema:
{
  "tdee": number,
  "target": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "summary": "a premium 2-3 sentence explanation of the macro split and training suggestions",
  "stack": ["slug1", "slug2", "slug3"]
}`;

  const userPrompt = `User biometrics:
- Gender: ${gender}
- Age: ${age} years
- Weight: ${weightKg} kg
- Height: ${heightCm} cm
- Goal: ${goal}
- Activity level: ${activityLevel}

Calculate using Mifflin-St Jeor equation. Align macro ratios with goals. Respond only with the JSON object.`;

  try {
    const rawResult = await callClaude(systemPrompt, userPrompt);
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResult.trim());
    } catch (parseErr) {
      // Clean result from potential markdown quotes
      const cleaned = rawResult.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedResult = JSON.parse(cleaned);
    }

    res.json(parsedResult);
  } catch (error) {
    res.status(500).json({ message: 'Error processing AI calculations: ' + error.message });
  }
});

// Save Nutrition Plan
router.post('/save-plan', protect, async (req, res) => {
  const { biometrics, macros, stackSlugs } = req.body;

  try {
    // Find product database IDs based on slugs
    const products = await Product.find({ slug: { $in: stackSlugs } });
    const productIds = products.map(p => p._id);

    const plan = new NutritionPlan({
      user: req.user._id,
      biometrics,
      macros,
      stack: productIds
    });

    const savedPlan = await plan.save();

    // Associate plan with user
    await User.findByIdAndUpdate(req.user._id, { nutritionPlan: savedPlan._id });

    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Interactive AI Chat
router.post('/chat', aiLimiter, async (req, res) => {
  const { history, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    const aiResponse = await callClaudeChat(history || [], message);
    res.json({ text: aiResponse });
  } catch (error) {
    res.status(500).json({ message: 'Error from chat AI: ' + error.message });
  }
});

export default router;
