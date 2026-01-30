import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      btcPrice: null,
      lastBtcUpdate: null,
      
      // Agregar producto al carrito
      addItem: (product) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        
        return {
          items: [...state.items, { ...product, quantity: 1 }]
        };
      }),
      
      // Agregar ítem manual (sin ID de producto)
      addManualItem: (amount, description = 'Monto Manual') => set((state) => {
        const manualItem = {
          id: `manual-${Date.now()}`,
          name: description,
          price: parseFloat(amount),
          quantity: 1,
          category: 'Manual',
          isManual: true
        };
        
        return {
          items: [...state.items, manualItem]
        };
      }),
      
      // Quitar producto del carrito (reducir cantidad o eliminar)
      removeItem: (productId) => set((state) => {
        const existingItem = state.items.find(item => item.id === productId);
        
        if (existingItem && existingItem.quantity > 1) {
          return {
            items: state.items.map(item =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          };
        }
        
        return {
          items: state.items.filter(item => item.id !== productId)
        };
      }),
      
      // Eliminar completamente un producto
      deleteItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      // Vaciar carrito
      clearCart: () => set({ items: [] }),
      
      // Calcular total
      getTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      },
      
      // Obtener cantidad total de items
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Obtener precio de Bitcoin
      fetchBtcPrice: async () => {
        try {
          // Intentar con CoinGecko primero
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
          const data = await response.json();
          
          if (data.bitcoin && data.bitcoin.usd) {
            set({ 
              btcPrice: data.bitcoin.usd,
              lastBtcUpdate: Date.now()
            });
            return data.bitcoin.usd;
          }
        } catch (error) {
          console.error('Error fetching BTC price from CoinGecko:', error);
          
          // Fallback a Mempool API
          try {
            const response = await fetch('https://mempool.space/api/v1/prices');
            const data = await response.json();
            
            if (data.USD) {
              set({ 
                btcPrice: data.USD,
                lastBtcUpdate: Date.now()
              });
              return data.USD;
            }
          } catch (fallbackError) {
            console.error('Error fetching BTC price from Mempool:', fallbackError);
            // Usar precio por defecto si falla
            set({ 
              btcPrice: 50000,
              lastBtcUpdate: Date.now()
            });
            return 50000;
          }
        }
      },
      
      // Convertir USD a sats
      convertToSats: (usdAmount) => {
        const state = get();
        if (!state.btcPrice) return 0;
        const btc = usdAmount / state.btcPrice;
        return Math.round(btc * 100000000); // Convertir a satoshis
      }
    }),
    {
      name: 'boltpos-cart-storage',
    }
  )
);
