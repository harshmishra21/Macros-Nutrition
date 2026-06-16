import fetch from 'node-fetch';

/**
 * Handles communication with Anthropic or fallback simulation.
 */
export const callClaude = async (systemPrompt, userPrompt) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey !== 'YOUR_ANTHROPIC_API_KEY') {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
      console.warn('Anthropic API call failed, falling back to simulation...', await response.text());
    } catch (err) {
      console.error('Error in callClaude: ', err);
    }
  }

  // High-fidelity fallback simulator
  return runNutritionSimulation(userPrompt);
};

// Simulated Chat responder
export const callClaudeChat = async (history, message) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey !== 'YOUR_ANTHROPIC_API_KEY') {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          system: 'You are MACROS AI, an elite sports nutrition assistant. Respond to the athlete concisely in terminal style.',
          messages: [
            ...history.map(h => ({ role: h.role, content: h.text })),
            { role: 'user', content: message }
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.content[0].text;
      }
    } catch (err) {
      console.error('Error in callClaudeChat: ', err);
    }
  }

  return runChatSimulation(message);
};

// Parser & Calculator for simulated macros
function runNutritionSimulation(userPrompt) {
  // Extract info from prompt (using Regex or defaults)
  const genderMatch = userPrompt.match(/(male|female|other)/i);
  const ageMatch = userPrompt.match(/(\d+)\s*y/i);
  const weightMatch = userPrompt.match(/(\d+)\s*kg/i);
  const heightMatch = userPrompt.match(/(\d+)\s*cm/i);

  const gender = genderMatch ? genderMatch[1].toLowerCase() : 'male';
  const age = ageMatch ? parseInt(ageMatch[1]) : 26;
  const weight = weightMatch ? parseInt(weightMatch[1]) : 75;
  const height = heightMatch ? parseInt(heightMatch[1]) : 175;

  let goal = 'muscle';
  if (userPrompt.match(/fatloss|fat loss|lean|cut/i)) goal = 'fatloss';
  else if (userPrompt.match(/performance|athletics|speed/i)) goal = 'performance';
  else if (userPrompt.match(/recovery|rehab/i)) goal = 'recovery';
  else if (userPrompt.match(/wellness|health|general/i)) goal = 'wellness';

  let activityLevel = 'moderately';
  if (userPrompt.match(/sedentary/i)) activityLevel = 'sedentary';
  else if (userPrompt.match(/lightly/i)) activityLevel = 'lightly';
  else if (userPrompt.match(/very|high|active/i)) activityLevel = 'very';
  else if (userPrompt.match(/elite|pro/i)) activityLevel = 'elite';

  // Mifflin-St Jeor BMR
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') bmr += 5;
  else if (gender === 'female') bmr -= 161;
  else bmr -= 80;

  // Activity Factor
  const activityFactors = {
    sedentary: 1.2,
    lightly: 1.375,
    moderately: 1.55,
    very: 1.725,
    elite: 1.9
  };
  const factor = activityFactors[activityLevel] || 1.55;
  const tdee = Math.round(bmr * factor);

  // Goal adjustment
  let target = tdee;
  let summary = '';
  let stack = [];

  if (goal === 'muscle') {
    target = tdee + 350;
    summary = `To build lean athletic mass, a controlled caloric surplus of 350 kcal is ideal. We've optimized your proteins to 2.2g per kg of bodyweight to maximize muscle protein synthesis. Ensure you consume 3-4 liters of water and focus on progressive overload in your workouts.`;
    stack = ['whey-isolate', 'creatine', 'bcaa-matrix'];
  } else if (goal === 'fatloss') {
    target = tdee - 500;
    summary = `For fat loss, a caloric deficit of 500 kcal is targeted. High protein intake ensures muscle mass preservation while in a energy deficit. Prioritize fibrous vegetables and clean hydration.`;
    stack = ['plant-protein', 'electrolytes', 'omega-3-epa-dha'];
  } else if (goal === 'performance') {
    target = tdee;
    summary = `Your plan is designed at maintenance calories to fuel high intensity performance. We've loaded complex carbohydrates to maximize glycogen levels and electrolytes to prevent dehydration during prolonged training sessions.`;
    stack = ['pre-workout', 'whey-isolate', 'electrolytes'];
  } else if (goal === 'recovery') {
    target = tdee;
    summary = `Recovery plan focused on reducing inflammatory biomarkers and accelerating muscle repair. We include micro and macronutrients that enhance cellular restoration and protein synthesis post-workout.`;
    stack = ['whey-concentrate', 'eaa-complex', 'omega-3-epa-dha'];
  } else {
    target = tdee;
    summary = `A balanced nutritional plan aimed at long-term cellular health, metabolic longevity, and sustained cognitive focus. Complete proteins and essential fatty acids form the foundation of this wellness protocol.`;
    stack = ['multivitamin', 'omega-3-epa-dha', 'protein-oats'];
  }

  // Macros split
  // Protein: 2.2g per kg for muscle, 2.0g for others
  const proteinGrams = Math.round(weight * (goal === 'muscle' ? 2.2 : 2.0));
  const proteinKcal = proteinGrams * 4;

  // Fat: 25% of target
  const fatKcal = Math.round(target * 0.25);
  const fatGrams = Math.round(fatKcal / 9);

  // Carbs: rest
  const carbsKcal = target - (proteinKcal + fatKcal);
  const carbsGrams = Math.round(carbsKcal / 4);

  return JSON.stringify({
    tdee,
    target,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams,
    summary,
    stack
  });
}

function runChatSimulation(message) {
  const msg = message.toLowerCase();

  if (msg.includes('creatine')) {
    return `MACROS_AI > Creatine Monohydrate increases phosphocreatine stores in muscles, boosting ATP production. Take 3-5g daily, consistently, at any time of day. No loading phase required, but stay hydrated (3-4L water daily).`;
  }
  if (msg.includes('pre-workout') || msg.includes('preworkout')) {
    return `MACROS_AI > Take Pre-workout 20-30 minutes before training. It provides Caffeine for neural stimulation, L-Citrulline for nitric oxide vasodilation (muscle pump), and Beta-Alanine for lactic acid buffering. Avoid taking within 6 hours of sleep.`;
  }
  if (msg.includes('whey') || msg.includes('protein')) {
    return `MACROS_AI > Whey Isolate provides rapid-absorbing amino acids, perfect for post-workout muscle protein synthesis. Plant Protein is an excellent lactose-free option with comparable amino profiles when blended properly. Target 1.6 - 2.2g of protein per kg of bodyweight.`;
  }
  if (msg.includes('vegetarian') || msg.includes('vegan')) {
    return `MACROS_AI > For vegetarian diets, ensure you blend sources (e.g., peas and brown rice) to complete the amino acid profile. Supplementing with Plant Protein, Creatine, and B12 is highly recommended to fill potential athletic gaps.`;
  }
  if (msg.includes('fat loss') || msg.includes('lose fat') || msg.includes('diet')) {
    return `MACROS_AI > Prioritize a 300-500 kcal deficit, keep protein high (2.0g/kg) to protect muscle, and add Thermogenic boosters like green tea extract. Track all liquid calories and focus on sleep quality.`;
  }

  return `MACROS_AI > Understood. Consuming optimal nutrition triggers protein synthesis, glycogen replenishment, and athletic adaptations. Let me know if you need to adjust your macros or require product ingredient specifications.`;
}
