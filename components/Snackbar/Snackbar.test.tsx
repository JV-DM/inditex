import { render, screen, fireEvent } from '@testing-library/react'
import { Snackbar } from './Snackbar'
import type { SnackbarState } from '../../hooks/useSnackbar'

const mockSnackbarSuccess: SnackbarState = {
  isVisible: true,
  message: 'Operation successful!',
  type: 'success',
}

const mockSnackbarError: SnackbarState = {
  isVisible: true,
  message: 'An error occurred',
  type: 'error',
}

const mockSnackbarHidden: SnackbarState = {
  isVisible: false,
  message: '',
  type: 'success',
}

describe('Snackbar', () => {
  it('renders success snackbar correctly', () => {
    const mockOnClose = jest.fn()
    render(<Snackbar snackbar={mockSnackbarSuccess} onClose={mockOnClose} />)

    expect(screen.getByText('Operation successful!')).toBeInTheDocument()
    expect(screen.getByLabelText('Close notification')).toBeInTheDocument()
  })

  it('renders error snackbar correctly', () => {
    const mockOnClose = jest.fn()
    render(<Snackbar snackbar={mockSnackbarError} onClose={mockOnClose} />)

    expect(screen.getByText('An error occurred')).toBeInTheDocument()
  })

  it('applies correct type class', () => {
    const mockOnClose = jest.fn()
    const { container } = render(
      <Snackbar snackbar={mockSnackbarError} onClose={mockOnClose} />
    )

    expect(container.firstChild).toHaveClass('error')
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn()
    render(<Snackbar snackbar={mockSnackbarSuccess} onClose={mockOnClose} />)

    const closeButton = screen.getByLabelText('Close notification')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('does not render when isVisible is false', () => {
    const mockOnClose = jest.fn()
    render(<Snackbar snackbar={mockSnackbarHidden} onClose={mockOnClose} />)

    expect(screen.queryByText('Operation successful!')).not.toBeInTheDocument()
    expect(
      screen.queryByLabelText('Close notification')
    ).not.toBeInTheDocument()
  })

  it('renders close button with correct text', () => {
    const mockOnClose = jest.fn()
    render(<Snackbar snackbar={mockSnackbarSuccess} onClose={mockOnClose} />)

    expect(screen.getByText('×')).toBeInTheDocument()
  })
})
