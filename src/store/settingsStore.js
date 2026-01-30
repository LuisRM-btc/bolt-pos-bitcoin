import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSettingsStore = create(
  persist(
    (set) => ({
      // Lightning Address configuración
      lightningAddress: 'purplerhapsody967062@getalby.com',
      
      // Configuración del negocio
      businessName: 'BoltPOS',
      
      // Actualizar Lightning Address
      setLightningAddress: (address) => set({ lightningAddress: address }),
      
      // Actualizar nombre del negocio
      setBusinessName: (name) => set({ businessName: name }),
    }),
    {
      name: 'boltpos-settings-storage',
    }
  )
);
