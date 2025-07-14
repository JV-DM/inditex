import { render, screen } from '@testing-library/react'
import { Navigation } from './Navigation'
import { CartProvider } from '../../contexts/CartContext'

const NavigationWithProvider = () => (
  <CartProvider>
    <Navigation />
  </CartProvider>
)

describe('Navigation', () => {
  it('renders the brand name', () => {
    render(<NavigationWithProvider />)
    expect(screen.getByText('PhoneStore')).toBeInTheDocument()
  })

  it('renders the cart icon', () => {
    render(<NavigationWithProvider />)
    expect(screen.getByText('CART')).toBeInTheDocument()
  })

  it('renders cart link with correct href', () => {
    render(<NavigationWithProvider />)
    const cartLink = screen.getByRole('link', { name: 'CART' })
    expect(cartLink).toHaveAttribute('href', '/cart')
  })

  it('does not show cart badge when cart is empty', () => {
    render(<NavigationWithProvider />)
    expect(screen.queryByText(/\d+/)).not.toBeInTheDocument()
  })
})