import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      isDark: true, // Por defecto en modo oscuro (el actual)
      
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      
      setTheme: (isDark) => set({ isDark }),
    }),
    {
      name: 'boltpos-theme-storage',
    }
  )
);
