import { renderHook, act } from '@testing-library/react'
import { usePhones } from './usePhones'

// Mock dependencies
jest.mock('../services/api', () => ({
  productsApi: {
    getProducts: jest.fn()
  }
}))

const mockGetProducts = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  
  const { productsApi } = require('../services/api')
  
  productsApi.getProducts = mockGetProducts
})

const mockPhones = [
  { id: '1', name: 'iPhone 12', brand: 'Apple', basePrice: 909, imageUrl: 'iphone.jpg' },
  { id: '2', name: 'Samsung Galaxy', brand: 'Samsung', basePrice: 799, imageUrl: 'samsung.jpg' }
]

describe('usePhones', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => usePhones())

    expect(result.current.phones).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)
  })

  it('fetches phones on mount', async () => {
    mockGetProducts.mockResolvedValueOnce(mockPhones)

    const { result } = renderHook(() => usePhones())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(mockGetProducts).toHaveBeenCalledWith({
      search: undefined,
      limit: 20
    })
    expect(result.current.phones).toEqual(mockPhones)
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('handles API error', async () => {
    const errorMessage = 'API Error'
    mockGetProducts.mockRejectedValueOnce(new Error(errorMessage))

    const { result } = renderHook(() => usePhones())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.phones).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe('Failed to load phones. Please try again.')
  })

  it('fetches phones with search query', async () => {
    mockGetProducts.mockResolvedValueOnce(mockPhones)

    const { result } = renderHook(() => usePhones())

    await act(async () => {
      await result.current.fetchPhones('iPhone')
    })

    expect(mockGetProducts).toHaveBeenCalledWith({
      search: 'iPhone',
      limit: 20
    })
  })

  it('removes duplicate phones by ID', async () => {
    const phonesWithDuplicates = [
      ...mockPhones,
      { id: '1', name: 'iPhone 12 Duplicate', brand: 'Apple', basePrice: 909, imageUrl: 'iphone.jpg' }
    ]
    mockGetProducts.mockResolvedValueOnce(phonesWithDuplicates)

    const { result } = renderHook(() => usePhones())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(result.current.phones).toHaveLength(2)
    expect(result.current.phones.find(p => p.id === '1')?.name).toBe('iPhone 12')
  })

  it('retries fetch with search query', async () => {
    mockGetProducts.mockResolvedValueOnce(mockPhones)

    const { result } = renderHook(() => usePhones())

    await act(async () => {
      await result.current.retryFetch('Samsung')
    })

    expect(mockGetProducts).toHaveBeenCalledWith({
      search: 'Samsung',
      limit: 20
    })
  })

  it('handles multiple fetch calls correctly', async () => {
    mockGetProducts.mockResolvedValueOnce(mockPhones)

    const { result } = renderHook(() => usePhones())

    await act(async () => {
      await result.current.fetchPhones()
    })

    expect(mockGetProducts).toHaveBeenCalledTimes(2) // Once on mount, once from explicit call
  })

  it('only fetches once on mount', async () => {
    mockGetProducts.mockResolvedValueOnce(mockPhones)

    const { result, rerender } = renderHook(() => usePhones())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    rerender()

    expect(mockGetProducts).toHaveBeenCalledTimes(1)
  })
})