import { render, screen } from '@testing-library/react'
import { Loading } from './Loading'

describe('Loading', () => {
  it('renders with default props', () => {
    render(<Loading />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<Loading text="Please wait..." />)

    expect(screen.getByText('Please wait...')).toBeInTheDocument()
  })

  it('renders without text when text prop is empty', () => {
    render(<Loading text="" />)

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('applies correct size class', () => {
    const { container } = render(<Loading size="large" />)
    
    expect(container.firstChild).toHaveClass('large')
  })

  it('applies overlay class when overlay prop is true', () => {
    const { container } = render(<Loading overlay={true} />)
    
    expect(container.firstChild).toHaveClass('overlay')
  })

  it('renders spinner element', () => {
    const { container } = render(<Loading />)
    
    expect(container.querySelector('.spinner')).toBeInTheDocument()
  })

  it('applies medium size by default', () => {
    const { container } = render(<Loading />)
    
    expect(container.firstChild).toHaveClass('medium')
  })
})