import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PhonesList } from './PhonesList'
import { CartProvider } from '../../contexts/CartContext'
import { productsApi } from '../../services/api'
import type { ProductListEntity } from '../../types/api'

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

jest.mock('../../services/api')
const mockProductsApi = productsApi as jest.Mocked<typeof productsApi>

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
    mockProductsApi.getProducts.mockResolvedValue(mockPhones)

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(screen.getByText('iPhone 12')).toBeInTheDocument()
      expect(screen.getByText('Galaxy S21')).toBeInTheDocument()
    })
  })

  it('displays loading state initially', () => {
    mockProductsApi.getProducts.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    )

    render(<PhonesListWithProvider />)

    // Check for loading skeletons
    const skeletons = document.querySelectorAll('.loadingSkeleton')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('displays error in snackbar when API call fails', async () => {
    mockProductsApi.getProducts.mockRejectedValue(
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
    mockProductsApi.getProducts.mockRejectedValue(
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

  it('continues to show interface even when there is an error', async () => {
    mockProductsApi.getProducts.mockRejectedValue(
      new Error('Failed to load phones. Please try again.')
    )

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(
        screen.getByText('Failed to load phones. Please try again.')
      ).toBeInTheDocument()
    })

    // Verify that the search input is still accessible
    expect(
      screen.getByPlaceholderText('Search for a smartphone...')
    ).toBeInTheDocument()

    // Verify that the empty state is shown instead of blocking error
    expect(screen.getByText('No phones found')).toBeInTheDocument()
  })

  it('displays empty state when no phones found', async () => {
    mockProductsApi.getProducts.mockResolvedValue([])

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(screen.getByText('No phones found')).toBeInTheDocument()
    })
  })

  it('filters phones when search is performed', async () => {
    mockProductsApi.getProducts.mockResolvedValue(mockPhones)

    render(<PhonesListWithProvider />)

    const searchInput = await screen.findByPlaceholderText(
      'Search for a smartphone...'
    )

    fireEvent.change(searchInput, { target: { value: 'iPhone' } })

    await waitFor(() => {
      expect(mockProductsApi.getProducts).toHaveBeenCalledWith({
        search: 'iPhone',
        limit: 20,
      })
    })
  })
})
