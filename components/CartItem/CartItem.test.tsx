import { render, screen, fireEvent } from '@testing-library/react'
import { CartItem } from './CartItem'
import type { CartItem as CartItemType } from '../../types/cart'

const mockCartItem: CartItemType = {
  id: '1',
  name: 'iPhone 12',
  brand: 'Apple',
  basePrice: 909,
  quantity: 2,
  selectedColor: {
    hexCode: '#000000',
    name: 'Black',
    imageUrl: 'https://example.com/black.jpg'
  },
  selectedStorage: {
    capacity: '128GB',
    price: 100
  }
}

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}))

describe('CartItem', () => {
  it('renders cart item information correctly', () => {
    render(<CartItem item={mockCartItem} />)

    expect(screen.getByText('iPhone 12')).toBeInTheDocument()
    expect(screen.getByText('128GB | BLACK')).toBeInTheDocument()
    expect(screen.getByText('2018 EUR')).toBeInTheDocument() // (909 + 100) * 2
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders item image with correct alt text', () => {
    render(<CartItem item={mockCartItem} />)

    const image = screen.getByAltText('iPhone 12')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/black.jpg')
  })

  it('calls onQuantityChange when quantity buttons are clicked', () => {
    const mockOnQuantityChange = jest.fn()
    render(<CartItem item={mockCartItem} onQuantityChange={mockOnQuantityChange} />)

    const increaseButton = screen.getByLabelText('Increase quantity')
    const decreaseButton = screen.getByLabelText('Decrease quantity')

    fireEvent.click(increaseButton)
    expect(mockOnQuantityChange).toHaveBeenCalledWith(mockCartItem, 3)

    fireEvent.click(decreaseButton)
    expect(mockOnQuantityChange).toHaveBeenCalledWith(mockCartItem, 1)
  })

  it('calls onRemove when remove button is clicked', () => {
    const mockOnRemove = jest.fn()
    render(<CartItem item={mockCartItem} onRemove={mockOnRemove} />)

    const removeButton = screen.getByText('Remove')
    fireEvent.click(removeButton)

    expect(mockOnRemove).toHaveBeenCalledWith(mockCartItem)
  })

  it('disables decrease button when quantity is 1', () => {
    const itemWithQuantity1 = { ...mockCartItem, quantity: 1 }
    render(<CartItem item={itemWithQuantity1} />)

    const decreaseButton = screen.getByLabelText('Decrease quantity')
    expect(decreaseButton).toBeDisabled()
  })

  it('does not render controls when readonly is true', () => {
    render(<CartItem item={mockCartItem} readonly={true} />)

    expect(screen.queryByText('Remove')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Increase quantity')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Decrease quantity')).not.toBeInTheDocument()
  })

  it('calculates total price correctly', () => {
    const customItem = { ...mockCartItem, basePrice: 500, quantity: 3 }
    render(<CartItem item={customItem} />)

    expect(screen.getByText('1800 EUR')).toBeInTheDocument() // (500 + 100) * 3
  })
})