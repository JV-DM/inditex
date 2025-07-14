'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import type { CartContextType, CartState, CartItem } from '../types/cart'

const CartContext = createContext<CartContextType | undefined>(undefined)

const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

const calculateTotals = (
  items: CartItem[]
): Pick<CartState, 'totalItems' | 'totalPrice'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.basePrice + item.selectedStorage.price) * item.quantity,
    0
  )
  return { totalItems, totalPrice }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartState>(initialCartState)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        const totals = calculateTotals(parsedCart.items || [])
        setCart({
          items: parsedCart.items || [],
          ...totals,
        })
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
      // Create unique ID based on product ID + storage + color
      const uniqueId = `${product.id}-${product.selectedStorage.capacity}-${product.selectedColor.hexCode}`
      
      const existingItem = prevCart.items.find(item => {
        const itemUniqueId = `${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`
        return itemUniqueId === uniqueId
      })

      let newItems: CartItem[]
      if (existingItem) {
        newItems = prevCart.items.map(item => {
          const itemUniqueId = `${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`
          return itemUniqueId === uniqueId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        })
      } else {
        newItems = [...prevCart.items, { ...product, quantity: 1 }]
      }

      const totals = calculateTotals(newItems)
      return {
        items: newItems,
        ...totals,
      }
    })
  }

  const removeFromCart = (uniqueId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => {
        const itemUniqueId = `${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`
        return itemUniqueId !== uniqueId
      })
      const totals = calculateTotals(newItems)
      return {
        items: newItems,
        ...totals,
      }
    })
  }

  const updateQuantity = (uniqueId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(uniqueId)
      return
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        const itemUniqueId = `${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`
        return itemUniqueId === uniqueId ? { ...item, quantity } : item
      })
      const totals = calculateTotals(newItems)
      return {
        items: newItems,
        ...totals,
      }
    })
  }

  const clearCart = () => {
    setCart(initialCartState)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
