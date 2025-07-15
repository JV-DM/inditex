import { render, screen, fireEvent } from '@testing-library/react'
import { PhoneCard } from './PhoneCard'
import { CartProvider } from '../../contexts/CartContext'
import type { ProductListEntity } from '../../types/api'

const mockPhone: ProductListEntity = {
  id: '1',
  brand: 'Apple',
  name: 'iPhone 12',
  basePrice: 909,
  imageUrl: 'https://example.com/iphone.jpg',
}

const PhoneCardWithProvider = ({ phone }: { phone: ProductListEntity }) => (
  <CartProvider>
    <PhoneCard phone={phone} />
  </CartProvider>
)

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    <img src={src} alt={alt} data-fill={fill} {...props} />
  ),
}))

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('PhoneCard', () => {
  it('renders phone information correctly', () => {
    render(<PhoneCardWithProvider phone={mockPhone} />)

    expect(screen.getByText('Apple')).toBeInTheDocument()
    expect(screen.getByText('iPhone 12')).toBeInTheDocument()
    expect(screen.getByText('909 EUR')).toBeInTheDocument()
  })

  it('renders phone image with correct alt text', () => {
    render(<PhoneCardWithProvider phone={mockPhone} />)

    const image = screen.getByAltText('iPhone 12')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/iphone.jpg')
  })

  it('renders as a link to product detail page', () => {
    render(<PhoneCardWithProvider phone={mockPhone} />)

    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/product/1')
  })

  it('formats price correctly', () => {
    const expensivePhone = { ...mockPhone, basePrice: 1234567 }
    render(<PhoneCardWithProvider phone={expensivePhone} />)

    expect(screen.getByText('1234567 EUR')).toBeInTheDocument()
  })
})
