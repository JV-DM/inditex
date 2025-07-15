import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PhonesList } from './PhonesList'
import { CartProvider } from '../../contexts/CartContext'
import type { ProductListEntity } from '../../types/api'
import { getProducts } from '@/services/api'

const mockPhones: ProductListEntity[] = [
  {
    id: '1',
    brand: 'Apple',
    name: 'iPhone 12',
    basePrice: 909,
    imageUrl: 'https://example.com/iphone.jpg',
  },
  {
    id: '2',
    brand: 'Samsung',
    name: 'Galaxy S21',
    basePrice: 799,
    imageUrl: 'https://example.com/galaxy.jpg',
  },
]

const PhonesListWithProvider = () => (
  <CartProvider>
    <PhonesList />
  </CartProvider>
)

jest.mock('@/services/api', () => ({
  getProducts: jest.fn(),
}))
const mockProductsApi = getProducts as jest.Mock

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, fill, ...props }: any) => (
    <img src={src} alt={alt} data-fill={fill} {...props} />
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

describe('PhonesList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders phones list correctly', async () => {
    mockProductsApi.mockResolvedValue(mockPhones)

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(screen.getByText('iPhone 12')).toBeInTheDocument()
      expect(screen.getByText('Galaxy S21')).toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    mockProductsApi.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<PhonesListWithProvider />)

    // Check for loading skeletons
    const skeletons = document.querySelectorAll('.loadingSkeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays error in snackbar when API call fails', async () => {
    mockProductsApi.mockRejectedValue(
      new Error('Failed to load phones. Please try again.')
    )

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load phones. Please try again.')
      ).toBeInTheDocument()
    })

    // Verify snackbar close button is present
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument()
  })

  it('closes snackbar when close button is clicked', async () => {
    mockProductsApi.mockRejectedValue(
      new Error('Failed to load phones. Please try again.')
    )

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load phones. Please try again.')
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByLabelText('Close notification'))

    await waitFor(() => {
      expect(
        screen.queryByText('Failed to load phones. Please try again.')
      ).not.toBeInTheDocument()
    })
  })

  it('filters phones when search is performed', async () => {
    mockProductsApi.mockResolvedValue(mockPhones)

    render(<PhonesListWithProvider />)

    const searchInput = await screen.findByPlaceholderText(
      'Search for a smartphone...'
    )

    fireEvent.change(searchInput, { target: { value: 'iPhone' } })

    await waitFor(() => {
      expect(mockProductsApi).toHaveBeenCalledWith({
        search: 'iPhone',
        limit: 20,
      })
    })
  })
})
