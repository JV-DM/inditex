import { renderHook, act } from '@testing-library/react'
import { useProductDetail } from './useProductDetail'

// Mock dependencies
jest.mock('../services/api', () => ({
  productsApi: {
    getProduct: jest.fn()
  }
}))

const mockGetProduct = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  
  const { productsApi } = require('../services/api')
  
  productsApi.getProduct = mockGetProduct
})

const mockProduct = {
  id: '1',
  name: 'iPhone 12',
  brand: 'Apple',
  basePrice: 909,
  imageUrl: 'iphone.jpg',
  description: 'Latest iPhone',
  storageOptions: [{ capacity: '128GB', price: 100 }],
  colorOptions: [{ hexCode: '#000000', name: 'Black', imageUrl: 'black.jpg' }],
  dimensions: { width: 71.5, height: 146.7, depth: 7.4, weight: 164 }
}

describe('useProductDetail', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    expect(result.current.product).toBe(null)
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('fetches product when productId is provided', async () => {
    mockGetProduct.mockResolvedValueOnce(mockProduct)

    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProduct).toHaveBeenCalledWith('1')
    expect(result.current.product).toEqual(mockProduct)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('does not fetch when productId is null', async () => {
    const { result } = renderHook(() => useProductDetail({ productId: null }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProduct).not.toHaveBeenCalled()
    expect(result.current.product).toBe(null)
  })

  it('does not fetch when enabled is false', async () => {
    const { result } = renderHook(() => useProductDetail({ productId: '1', enabled: false }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProduct).not.toHaveBeenCalled()
    expect(result.current.product).toBe(null)
  })

  it('handles API error', async () => {
    const errorMessage = 'Product not found'
    mockGetProduct.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.product).toBe(null)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(errorMessage)
  })

  it('handles non-Error rejection', async () => {
    mockGetProduct.mockRejectedValueOnce('Some error')

    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.error).toBe('Failed to load product details')
  })

  it('refetches product when refetch is called', async () => {
    mockGetProduct.mockResolvedValueOnce(mockProduct)

    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    mockGetProduct.mockClear()
    mockGetProduct.mockResolvedValueOnce(mockProduct)

    await act(async () => {
      result.current.refetch()
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProduct).toHaveBeenCalledWith('1')
  })

  it('refetches when productId changes', async () => {
    mockGetProduct.mockResolvedValueOnce(mockProduct)

    const { result, rerender } = renderHook(
      ({ productId }) => useProductDetail({ productId }),
      { initialProps: { productId: '1' } }
    )

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProduct).toHaveBeenCalledWith('1')

    mockGetProduct.mockClear()
    mockGetProduct.mockResolvedValueOnce({ ...mockProduct, id: '2' })

    rerender({ productId: '2' })

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProduct).toHaveBeenCalledWith('2')
  })

  it('handles successful product fetch', async () => {
    mockGetProduct.mockResolvedValueOnce(mockProduct)

    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.product).toEqual(mockProduct)
    expect(result.current.error).toBe(null)
  })

  it('sets local loading state correctly', async () => {
    let resolvePromise: (value: any) => void
    const pendingPromise = new Promise(resolve => {
      resolvePromise = resolve
    })
    mockGetProduct.mockReturnValueOnce(pendingPromise)

    const { result } = renderHook(() => useProductDetail({ productId: '1' }))

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolvePromise(mockProduct)
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.loading).toBe(false)
  })
})