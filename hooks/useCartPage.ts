import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '../contexts/CartContext'
import { useSnackbar } from './useSnackbar'
import type {
  PaymentStatus,
  CartOperationResult,
  CartError,
} from '../types/cart'

export interface UseCartPageReturn {
  cart: ReturnType<typeof useCart>['cart']
  isLoading: boolean
  paymentStatus: PaymentStatus
  snackbar: ReturnType<typeof useSnackbar>['snackbar']
  hideSnackbar: ReturnType<typeof useSnackbar>['hideSnackbar']
  handleContinueShopping: () => void
  handlePayment: () => void
  handleCheckout: () => Promise<CartOperationResult>
}

export const useCartPage = (): UseCartPageReturn => {
  const { cart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle')
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar()

  const handleContinueShopping = useCallback(() => {
    router.push('/')
  }, [router])

  const handlePayment = useCallback(() => {
    showSnackbar('Payment processing failed. Please try again.', 'error')
  }, [showSnackbar])

  const handleCheckout = useCallback(async (): Promise<CartOperationResult> => {
    setIsLoading(true)
    setPaymentStatus('processing')

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate random success/failure of api
      const success = Math.random() > 0.3

      if (success) {
        setPaymentStatus('success')
        showSnackbar('Order placed successfully!', 'success')

        return { success: true }
      } else {
        throw new Error('Payment processing failed')
      }
    } catch (error) {
      setPaymentStatus('failed')
      const cartError: CartError = {
        type: 'PAYMENT_FAILED',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
        details: { originalError: error },
      }
      showSnackbar(cartError.message, 'error')

      return { success: false, error: cartError }
    } finally {
      setIsLoading(false)
      setTimeout(() => setPaymentStatus('idle'), 3000)
    }
  }, [cart.items.length, showSnackbar])

  return {
    cart,
    isLoading,
    paymentStatus,
    snackbar,
    hideSnackbar,
    handleContinueShopping,
    handlePayment,
    handleCheckout,
  }
}
