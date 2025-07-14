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

// Mock the API
jest.mock('../../services/api')
const mockProductsApi = productsApi as jest.Mocked<typeof productsApi>

// Mock Next.js Image and Link components
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

  it('displays error state when API call fails', async () => {
    mockProductsApi.getProducts.mockRejectedValue(new Error('API Error'))

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })
  })

  it('retries API call when retry button is clicked', async () => {
    mockProductsApi.getProducts.mockRejectedValueOnce(new Error('API Error'))
    mockProductsApi.getProducts.mockResolvedValueOnce(mockPhones)

    render(<PhonesListWithProvider />)

    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Try Again'))

    await waitFor(() => {
      expect(screen.getByText('iPhone 12')).toBeInTheDocument()
    })
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
      'Search phones by name or brand...'
    )

    fireEvent.change(searchInput, { target: { value: 'iPhone' } })

    await waitFor(() => {
      expect(mockProductsApi.getProducts).toHaveBeenCalledWith({
        search: 'iPhone',
        limit: 20,
      })
    })
  })

  it('renders page title', () => {
    mockProductsApi.getProducts.mockResolvedValue(mockPhones)

    render(<PhonesListWithProvider />)

    expect(screen.getByText('Phone Store')).toBeInTheDocument()
  })
})