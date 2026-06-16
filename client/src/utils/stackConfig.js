import { getProductById } from './products.js';

function stackItem(productId, size = 'Standard') {
  const p = getProductById(productId);
  if (!p) return null;
  return {
    id: String(p.id),
    name: p.name.replace('Macros Nutrition ', ''),
    slug: p.slug,
    price: p.price,
    size,
    image: p.image,
    flavor: p.flavor,
  };
}

export const stackConfig = {
  muscle: {
    title: 'Muscle Gain 💪',
    sub: 'Accelerate muscle protein synthesis and ATP muscle torque.',
    products: [
      stackItem(26, '1 kg'),
      stackItem(2, '250 g'),
      stackItem(1, '250 g'),
    ].filter(Boolean),
  },
  fatloss: {
    title: 'Fat Loss 🔥',
    sub: 'Protect lean muscle tissue while operating in metabolic deficit.',
    products: [
      stackItem(10, '1 kg'),
      stackItem(3, '200 g'),
      stackItem(8, '60 caps'),
    ].filter(Boolean),
  },
  performance: {
    title: 'Peak Performance ⚡',
    sub: 'Fuel high-intensity cellular endurance and lactic buffering.',
    products: [
      stackItem(11, '300 g'),
      stackItem(26, '1 kg'),
      stackItem(3, '200 g'),
    ].filter(Boolean),
  },
  recovery: {
    title: 'Rapid Recovery 🌿',
    sub: 'Reduce joint friction and accelerate muscle tissue repair.',
    products: [
      stackItem(17, '1 kg'),
      stackItem(1, '250 g'),
      stackItem(8, '60 caps'),
    ].filter(Boolean),
  },
  wellness: {
    title: 'General Wellness ✨',
    sub: 'Fill vital micronutrient gaps and sustain metabolic longevity.',
    products: [
      stackItem(7, '60 Tabs'),
      stackItem(8, '60 caps'),
      stackItem(5, '400 g'),
    ].filter(Boolean),
  },
};

export default stackConfig;
