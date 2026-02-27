import { Product } from '@/payload-types'
import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
} from 'zustand/middleware'

export type CartItem = {
  product: Product
}

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  validateItems: () => Promise<void>
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return { items: [...state.items, { product }] }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter(
            (item) => item.product.id !== id
          ),
        })),
      clearCart: () => set({ items: [] }),
      validateItems: async () => {
        const currentItems = get().items
        const validatedItems = await Promise.all(
          currentItems.map(async (item) => {
            try {
              const response = await fetch(`/api/products/${item.product.id}`)
              if (response.ok) {
                return item
              }
              return null
            } catch (error) {
              console.error('Error validating product:', error)
              return null
            }
          })
        )
        set({ items: validatedItems.filter((item): item is CartItem => item !== null) })
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)