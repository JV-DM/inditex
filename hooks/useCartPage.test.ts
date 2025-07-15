import { renderHook, act } from '@testing-library/react'
import { useCartPage } from './useCartPage'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}))

jest.mock('../contexts/CartContext', () => ({
  useCart: jest.fn(() => ({
    cart: {
      items: [],
      totalPrice: 0,
      totalItems: 0,
    },
  })),
}))

jest.mock('./useSnackbar', () => ({
  useSnackbar: jest.fn(() => ({
    snackbar: { isVisible: false, message: '', type: 'info' },
    showSnackbar: jest.fn(),
    hideSnackbar: jest.fn(),
  })),
}))

const mockPush = jest.fn()
const mockShowSnackbar = jest.fn()
const mockHideSnackbar = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()

  const { useRouter } = require('next/navigation')
  const { useSnackbar } = require('./useSnackbar')

  useRouter.mockReturnValue({ push: mockPush })
  useSnackbar.mockReturnValue({
    snackbar: { isVisible: false, message: '', type: 'info' },
    showSnackbar: mockShowSnackbar,
    hideSnackbar: mockHideSnackbar,
  })
})

describe('useCartPage', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useCartPage())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.paymentStatus).toBe('idle')
    expect(typeof result.current.handleContinueShopping).toBe('function')
    expect(typeof result.current.handleCheckout).toBe('function')
  })

  it('navigates to home when handleContinueShopping is called', () => {
    const { result } = renderHook(() => useCartPage())

    act(() => {
      result.current.handleContinueShopping()
    })

    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('shows error snackbar when handlePayment is called', () => {
    const { result } = renderHook(() => useCartPage())

    act(() => {
      result.current.handlePayment()
    })

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      'Payment processing failed. Please try again.',
      'error'
    )
  })

  it('handles successful checkout', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5)

    const { result } = renderHook(() => useCartPage())

    let checkoutResult: any
    await act(async () => {
      checkoutResult = await result.current.handleCheckout()
    })

    expect(checkoutResult.success).toBe(true)
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      'Order placed successfully!',
      'success'
    )
    expect(result.current.paymentStatus).toBe('success')
  })

  it('handles failed checkout', async () => {
    // Mock Math.random to return a value <= 0.3 (failure case)
    jest.spyOn(Math, 'random').mockReturnValue(0.2)

    const { result } = renderHook(() => useCartPage())

    let checkoutResult: any
    await act(async () => {
      checkoutResult = await result.current.handleCheckout()
    })

    expect(checkoutResult.success).toBe(false)
    expect(checkoutResult.error).toBeDefined()
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      'Payment processing failed',
      'error'
    )
    expect(result.current.paymentStatus).toBe('failed')
  })

  it('sets loading state during checkout', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5)

    const { result } = renderHook(() => useCartPage())

    await act(async () => {
      await result.current.handleCheckout()
    })

    // Should not be loading after checkout
    expect(result.current.isLoading).toBe(false)
    expect(result.current.paymentStatus).toBe('success')
  })

  it('provides expected functions and state', () => {
    const { result } = renderHook(() => useCartPage())

    expect(typeof result.current.handleContinueShopping).toBe('function')
    expect(typeof result.current.handleCheckout).toBe('function')
    expect(typeof result.current.handlePayment).toBe('function')
    expect(typeof result.current.hideSnackbar).toBe('function')
    expect(result.current.cart).toBeDefined()
    expect(result.current.snackbar).toBeDefined()
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllTimers()
  })
})
