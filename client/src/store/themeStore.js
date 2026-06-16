import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () =>
        set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: 'macros-theme',
    }
  )
);
