import { shopProducts, getProductById } from './products.js';

export const featuredUniverseProducts = [
  getProductById(26), // Whey Isolate Chocolate
  getProductById(11), // Pre-Workout Mango
  getProductById(12), // Protein Bar Cookies & Cream
  getProductById(2),  // Creatine
  getProductById(10), // Plant Protein
  getProductById(3),  // Electrolytes
].filter(Boolean);

export const ecosystemProducts = [
  { productId: 17, macros: ['24G PROTEIN', '3G CARBS', '130 KCAL'] },
  { productId: 1, macros: ['5G BCAAS', '0G SUGAR', '0 KCAL'] },
  { productId: 3, macros: ['900MG SODIUM', '1G CARBS', '5 KCAL'] },
  { productId: 8, macros: ['1000MG OIL', '900MG OMEGA-3', '10 KCAL'] },
  { productId: 15, macros: ['15G PROTEIN', '8G FIBER', '180 KCAL'] },
  { productId: 5, macros: ['20G PROTEIN', '32G CARBS', '220 KCAL'] },
  { productId: 7, macros: ['37 KEY ACTIVE', 'IMMUNE BLEND', '0 KCAL'] },
  { productId: 9, macros: ['30G PROTEIN', 'HEALTHY FATS', '190 KCAL'] },
].map(({ productId, macros }) => {
  const product = getProductById(productId);
  return product ? { ...product, macros } : null;
}).filter(Boolean);

export const orbitProductImages = [
  getProductById(26),
  getProductById(17),
  getProductById(11),
  getProductById(2),
  getProductById(10),
  getProductById(12),
].filter(Boolean);

export const flavorProductMap = {
  darkChocolate: getProductById(26),
  strawberry: getProductById(27),
  mango: getProductById(19),
  vanilla: getProductById(28),
  pomegranate: getProductById(20),
};
