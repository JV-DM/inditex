import { render, screen } from '@testing-library/react'
import { Navigation } from './Navigation'
import { CartProvider } from '../../contexts/CartContext'

const NavigationWithProvider = () => (
  <CartProvider>
    <Navigation />
  </CartProvider>
)

// Mock Next.js Image and Link components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('Navigation', () => {
  it('renders the brand logo', () => {
    render(<NavigationWithProvider />)
    expect(screen.getByAltText('Logo')).toBeInTheDocument()
  })

  it('renders the cart icon with item count', () => {
    render(<NavigationWithProvider />)
    expect(screen.getByAltText('Cart')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders cart link with correct href', () => {
    render(<NavigationWithProvider />)
    const cartLink = screen.getByRole('link', { name: /cart/i })
    expect(cartLink).toHaveAttribute('href', '/cart')
  })

  it('renders brand link with correct href', () => {
    render(<NavigationWithProvider />)
    const brandLink = screen.getByRole('link', { name: /logo/i })
    expect(brandLink).toHaveAttribute('href', '/')
  })
})
