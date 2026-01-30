import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLanguageStore = create(
  persist(
    (set) => ({
      currentLanguage: 'en', // Inglés por defecto
      
      setLanguage: (language) => set({ currentLanguage: language }),
      
      toggleLanguage: () => set((state) => ({
        currentLanguage: state.currentLanguage === 'en' ? 'es' : 'en'
      })),
    }),
    {
      name: 'boltpos-language-storage',
    }
  )
);
