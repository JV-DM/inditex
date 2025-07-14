export type CartItem = {
  id: string
  name: string
  brand: string
  basePrice: number
  imageUrl: string
  quantity: number
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
