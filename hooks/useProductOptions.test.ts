import { renderHook, act } from '@testing-library/react'
import { useProductOptions } from './useProductOptions'
import type { ProductEntity, StorageOption, ColorOption } from '../types/api'

const mockStorageOptions: StorageOption[] = [
  { capacity: '64GB', price: 0 },
  { capacity: '128GB', price: 100 },
  { capacity: '256GB', price: 200 }
]

const mockColorOptions: ColorOption[] = [
  { hexCode: '#000000', name: 'Black', imageUrl: 'black.jpg' },
  { hexCode: '#ffffff', name: 'White', imageUrl: 'white.jpg' },
  { hexCode: '#ff0000', name: 'Red', imageUrl: 'red.jpg' }
]

const mockProduct: ProductEntity = {
  id: '1',
  name: 'iPhone 12',
  brand: 'Apple',
  imageUrl: 'iphone.jpg',
  description: 'Latest iPhone',
  basePrice: 909,
  storageOptions: mockStorageOptions,
  colorOptions: mockColorOptions,
  dimensions: {
    width: 71.5,
    height: 146.7,
    depth: 7.4,
    weight: 164
  }
}

describe('useProductOptions', () => {
  it('initializes with default selections when product is provided', () => {
    const { result } = renderHook(() => useProductOptions({ product: mockProduct }))

    expect(result.current.isInitialized).toBe(true)
    expect(result.current.selectedStorage).toEqual(mockStorageOptions[0])
    expect(result.current.selectedColor).toEqual(mockColorOptions[0])
    expect(result.current.isValidSelection).toBe(true)
  })

  it('does not initialize when product is null', () => {
    const { result } = renderHook(() => useProductOptions({ product: null }))

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.isValidSelection).toBe(false)
  })

  it('does not initialize when product has no storage options', () => {
    const productWithoutStorage = { ...mockProduct, storageOptions: [] }
    const { result } = renderHook(() => useProductOptions({ product: productWithoutStorage }))

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.isValidSelection).toBe(false)
  })

  it('does not initialize when product has no color options', () => {
    const productWithoutColors = { ...mockProduct, colorOptions: [] }
    const { result } = renderHook(() => useProductOptions({ product: productWithoutColors }))

    expect(result.current.isInitialized).toBe(false)
    expect(result.current.isValidSelection).toBe(false)
  })

  it('updates selected storage when setSelectedStorage is called', () => {
    const { result } = renderHook(() => useProductOptions({ product: mockProduct }))

    act(() => {
      result.current.setSelectedStorage(mockStorageOptions[1])
    })

    expect(result.current.selectedStorage).toEqual(mockStorageOptions[1])
  })

  it('updates selected color when setSelectedColor is called', () => {
    const { result } = renderHook(() => useProductOptions({ product: mockProduct }))

    act(() => {
      result.current.setSelectedColor(mockColorOptions[1])
    })

    expect(result.current.selectedColor).toEqual(mockColorOptions[1])
  })

  it('resets selections to defaults when resetSelections is called', () => {
    const { result } = renderHook(() => useProductOptions({ product: mockProduct }))

    act(() => {
      result.current.setSelectedStorage(mockStorageOptions[2])
      result.current.setSelectedColor(mockColorOptions[2])
    })

    expect(result.current.selectedStorage).toEqual(mockStorageOptions[2])
    expect(result.current.selectedColor).toEqual(mockColorOptions[2])

    act(() => {
      result.current.resetSelections()
    })

    expect(result.current.selectedStorage).toEqual(mockStorageOptions[0])
    expect(result.current.selectedColor).toEqual(mockColorOptions[0])
  })

  it('calls onSelectionChange when selections change', () => {
    const mockOnSelectionChange = jest.fn()
    const { result } = renderHook(() => useProductOptions({ 
      product: mockProduct, 
      onSelectionChange: mockOnSelectionChange 
    }))

    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      storage: mockStorageOptions[0],
      color: mockColorOptions[0]
    })

    act(() => {
      result.current.setSelectedStorage(mockStorageOptions[1])
    })

    expect(mockOnSelectionChange).toHaveBeenCalledWith({
      storage: mockStorageOptions[1],
      color: mockColorOptions[0]
    })
  })

  it('does not call onSelectionChange when not initialized', () => {
    const mockOnSelectionChange = jest.fn()
    renderHook(() => useProductOptions({ 
      product: null, 
      onSelectionChange: mockOnSelectionChange 
    }))

    expect(mockOnSelectionChange).not.toHaveBeenCalled()
  })

  it('validates selections correctly', () => {
    const { result } = renderHook(() => useProductOptions({ product: mockProduct }))

    expect(result.current.isValidSelection).toBe(true)

    // Test with a storage option not in the product
    act(() => {
      result.current.setSelectedStorage({ capacity: '512GB', price: 400 })
    })

    expect(result.current.isValidSelection).toBe(false)
  })

  it('updates when product changes', () => {
    const { result, rerender } = renderHook(
      ({ product }) => useProductOptions({ product }),
      { initialProps: { product: mockProduct } }
    )

    expect(result.current.selectedStorage).toEqual(mockStorageOptions[0])

    const newProduct = {
      ...mockProduct,
      storageOptions: [{ capacity: '512GB', price: 300 }]
    }

    rerender({ product: newProduct })

    expect(result.current.selectedStorage).toEqual(newProduct.storageOptions[0])
  })
})