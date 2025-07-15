export type CartItem = {
  id: string
  name: string
  brand: string
  basePrice: number
  imageUrl: string
  quantity: number
  selectedStorage: {
    capacity: string
    price: number
  }
  selectedColor: {
    hexCode: string
    name: string
    imageUrl: string
  }
}

export type CartState = {
  items: CartItem[]
  totalItems: number
  totalPrice: number
}

export type CartContextType = {
  cart: CartState
  addToCart: (product: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export type CartError = {
  type: 'PAYMENT_FAILED' | 'NETWORK_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN_ERROR'
  message: string
  details?: Record<string, unknown>
}

export type CartOperationResult<T = void> = {
  success: boolean
  data?: T
  error?: CartError
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed'

export type CheckoutData = {
  items: CartItem[]
  totalAmount: number
  currency: string
  timestamp: Date
}
