import productsData from '../data/products.json';

const NEW_PRODUCT_IDS = new Set([21, 22, 23, 24, 25, 26, 27, 28]);

const FLAVOR_COLORS = {
  watermelon: '#FF6B8A',
  unflavored: '#A8B4C0',
  orange: '#FF8C00',
  'tropical mango': '#F5A623',
  chocolate: '#5C4033',
  'chocolate fudge': '#4A2F13',
  creamy: '#DEB887',
  mango: '#FFD700',
  'cookies & cream': '#F5E6D3',
  hazelnut: '#8B6914',
  'peri peri': '#E63946',
  'double chocolate': '#3D2314',
  'peanut butter': '#C4A35A',
  strawberry: '#FF69B4',
  blueberry: '#4A6FA5',
  vanilla: '#F0E6C8',
  'mixed flavors': '#C9A84C',
};

const CATEGORY_GOALS = {
  Protein: ['muscle', 'recovery', 'performance'],
  Supplements: ['muscle', 'recovery', 'wellness'],
  Performance: ['performance', 'muscle'],
  Hydration: ['performance', 'recovery'],
  Drinks: ['performance', 'recovery'],
  'Healthy Foods': ['wellness', 'muscle'],
  Vitamins: ['wellness', 'recovery'],
  'Protein Snacks': ['muscle', 'recovery'],
  Dairy: ['muscle', 'recovery'],
  Collection: ['wellness'],
};

export const PRODUCT_CATEGORIES = [
  'Supplements',
  'Hydration',
  'Drinks',
  'Healthy Foods',
  'Vitamins',
  'Protein',
  'Performance',
  'Protein Snacks',
  'Dairy',
];

export const MAX_CATALOG_PRICE = 5000;

export function getProductImageUrl(imageFilename) {
  if (!imageFilename) return '';
  return `/images/${encodeURIComponent(imageFilename)}`;
}

export function generateSlug(name, flavor) {
  const base = `${name} ${flavor}`
    .toLowerCase()
    .replace(/macros nutrition\s*/gi, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return base;
}

export function getFlavorColor(flavor) {
  const key = (flavor || '').toLowerCase();
  return FLAVOR_COLORS[key] || '#C9A84C';
}

export function getDiscountPercent(mrp, price) {
  if (!mrp || mrp <= 0 || price >= mrp) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function getProductBadges(category, id) {
  const badges = [];
  if (category === 'Protein') badges.push('High Protein');
  if (category === 'Supplements') badges.push('Gym Essential');
  if (category === 'Performance') badges.push('Athlete Choice');
  if (NEW_PRODUCT_IDS.has(id)) badges.push('New Launch');
  return badges;
}

function inferMacros(category, name) {
  const lower = name.toLowerCase();
  if (category === 'Protein' || lower.includes('protein')) {
    return { protein: 24, carbs: 3, fat: 2, calories: 130, servingSize: '1 Scoop' };
  }
  if (category === 'Protein Snacks') {
    return { protein: 12, carbs: 8, fat: 5, calories: 150, servingSize: '1 Pack' };
  }
  if (category === 'Drinks') {
    return { protein: 15, carbs: 4, fat: 1, calories: 90, servingSize: '250 ml' };
  }
  return { protein: 0, carbs: 0, fat: 0, calories: 0, servingSize: '1 Serving' };
}

export function transformProduct(raw) {
  const slug = generateSlug(raw.name, raw.flavor);
  const badges = getProductBadges(raw.category, raw.id);
  const isCollection = raw.category === 'Collection';

  return {
    _id: String(raw.id),
    id: raw.id,
    slug,
    name: raw.name,
    flavor: raw.flavor,
    image: raw.image,
    description: raw.description,
    shortDesc: raw.description,
    category: raw.category,
    categorySlug: raw.category.toLowerCase().replace(/\s+/g, '-'),
    mrp: raw.mrp,
    price: raw.price,
    sizes: [{ weight: 'Standard', price: raw.price, mrp: raw.mrp }],
    flavors: [{
      name: raw.flavor,
      colorHex: getFlavorColor(raw.flavor),
      kcal: inferMacros(raw.category, raw.name).calories,
      inStock: true,
    }],
    macros: inferMacros(raw.category, raw.name),
    ingredients: `Premium quality ingredients formulated by Macros Nutrition. Flavor: ${raw.flavor}.`,
    goals: CATEGORY_GOALS[raw.category] || ['wellness'],
    tags: badges,
    rating: 4.8,
    reviewCount: 24 + (raw.id % 50),
    salesCount: 100 + raw.id * 15,
    featured: raw.id <= 11,
    isCollection,
    purchasable: !isCollection && raw.price > 0,
  };
}

export const allProducts = productsData.map(transformProduct);

export const shopProducts = allProducts.filter((p) => !p.isCollection);

export function getProductBySlug(slugOrId) {
  return allProducts.find(
    (p) => p.slug === slugOrId || String(p.id) === String(slugOrId) || p._id === String(slugOrId)
  );
}

export function getProductById(id) {
  return allProducts.find((p) => p.id === id || p._id === String(id));
}

export function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  return shopProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function filterProducts(products, filters = {}) {
  let result = [...products];

  if (filters.category && filters.category !== 'all') {
    const cat = filters.category;
    result = result.filter(
      (p) => p.categorySlug === cat || p.category.toLowerCase().replace(/\s+/g, '-') === cat
    );
  }

  if (filters.goal) {
    const goals = filters.goal.split(',').filter(Boolean);
    if (goals.length > 0) {
      result = result.filter((p) => p.goals?.some((g) => goals.includes(g)));
    }
  }

  if (filters.maxPrice && Number(filters.maxPrice) < MAX_CATALOG_PRICE) {
    result = result.filter((p) => p.price <= Number(filters.maxPrice));
  }

  if (filters.minPrice) {
    result = result.filter((p) => p.price >= Number(filters.minPrice));
  }

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.flavor.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'bestsellers':
      result.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case 'newest':
      result.sort((a, b) => b.id - a.id);
      break;
    case 'featured':
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id);
      break;
  }

  return result;
}

/** @deprecated Use getProductBySlug — kept for CartPage backward compat */
export const productMetadata = Object.fromEntries(
  allProducts.map((p) => [p.slug, { name: p.name, description: p.description, image: p.image, category: p.category, flavor: p.flavor }])
);
