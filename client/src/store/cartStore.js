import { create } from 'zustand';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('macros_cart');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('macros_cart', JSON.stringify(items));
};

export const useCartStore = create((set, get) => ({
  items: loadCart(),

  addItem: (item) => {
    // item: { product: id, name, flavor, size, quantity, price, image }
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(
      (i) => i.product === item.product && i.flavor === item.flavor && i.size === item.size
    );

    let newItems;
    if (existingIndex > -1) {
      newItems = [...currentItems];
      newItems[existingIndex].quantity += item.quantity || 1;
    } else {
      newItems = [...currentItems, { ...item, quantity: item.quantity || 1 }];
    }

    set({ items: newItems });
    saveCart(newItems);
  },

  addStack: (stackItems) => {
    // Add multiple products (used for stack builder bundle additions)
    const currentItems = get().items;
    let newItems = [...currentItems];

    stackItems.forEach((item) => {
      const existingIndex = newItems.findIndex(
        (i) => i.product === item.product && i.flavor === item.flavor && i.size === item.size
      );

      if (existingIndex > -1) {
        newItems[existingIndex].quantity += 1;
      } else {
        newItems.push({ ...item, quantity: 1 });
      }
    });

    set({ items: newItems });
    saveCart(newItems);
  },

  removeItem: (productId, flavor, size) => {
    const newItems = get().items.filter(
      (i) => !(i.product === productId && i.flavor === flavor && i.size === size)
    );
    set({ items: newItems });
    saveCart(newItems);
  },

  updateQuantity: (productId, flavor, size, quantity) => {
    const newItems = get().items.map((item) => {
      if (item.product === productId && item.flavor === flavor && item.size === size) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });
    set({ items: newItems });
    saveCart(newItems);
  },

  clearCart: () => {
    set({ items: [] });
    saveCart([]);
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  }
}));
