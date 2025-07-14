import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SearchBar } from './SearchBar'

const mockOnSearch = jest.fn()

describe('SearchBar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={0} />)

    expect(
      screen.getByPlaceholderText('Search phones by name or brand...')
    ).toBeInTheDocument()
  })

  it('renders search icon', () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={0} />)

    expect(screen.getByText('🔍')).toBeInTheDocument()
  })

  it('calls onSearch when user types', async () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={0} />)

    const input = screen.getByPlaceholderText('Search phones by name or brand...')
    fireEvent.change(input, { target: { value: 'iPhone' } })

    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledWith('iPhone')
      },
      { timeout: 400 }
    )
  })

  it('debounces search calls', async () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={0} />)

    const input = screen.getByPlaceholderText('Search phones by name or brand...')
    
    fireEvent.change(input, { target: { value: 'i' } })
    fireEvent.change(input, { target: { value: 'iP' } })
    fireEvent.change(input, { target: { value: 'iPhone' } })

    // Should only call once after debounce delay
    await waitFor(
      () => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1)
        expect(mockOnSearch).toHaveBeenCalledWith('iPhone')
      },
      { timeout: 400 }
    )
  })

  it('displays results count correctly', () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={5} />)

    expect(screen.getByText('Showing all phones')).toBeInTheDocument()
  })

  it('shows loading spinner when isLoading is true', () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={0} isLoading={true} />)

    expect(document.querySelector('.spinnerIcon')).toBeInTheDocument()
  })

  it('displays search results count with query', async () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={3} />)

    const input = screen.getByPlaceholderText('Search phones by name or brand...')
    fireEvent.change(input, { target: { value: 'Samsung' } })

    await waitFor(() => {
      expect(screen.getByText('3 results found for "Samsung"')).toBeInTheDocument()
    })
  })

  it('shows singular result text for one result', async () => {
    render(<SearchBar onSearch={mockOnSearch} resultsCount={1} />)

    const input = screen.getByPlaceholderText('Search phones by name or brand...')
    fireEvent.change(input, { target: { value: 'iPhone' } })

    await waitFor(() => {
      expect(screen.getByText('1 result found for "iPhone"')).toBeInTheDocument()
    })
  })
})