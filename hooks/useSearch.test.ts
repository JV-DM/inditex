import { renderHook, act } from '@testing-library/react'
import { useSearch } from './useSearch'

jest.useFakeTimers()

describe('useSearch', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.useFakeTimers()
  })

  it('initializes with empty query', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() => useSearch({ onSearch: mockOnSearch }))

    expect(result.current.query).toBe('')
  })

  it('updates query when updateQuery is called', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() => useSearch({ onSearch: mockOnSearch }))

    act(() => {
      result.current.updateQuery('test')
    })

    expect(result.current.query).toBe('test')
  })

  it('clears query when clearQuery is called', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() => useSearch({ onSearch: mockOnSearch }))

    act(() => {
      result.current.updateQuery('test')
    })

    expect(result.current.query).toBe('test')

    act(() => {
      result.current.clearQuery()
    })

    expect(result.current.query).toBe('')
  })

  it('calls onSearch after default debounce delay', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() => useSearch({ onSearch: mockOnSearch }))

    act(() => {
      result.current.updateQuery('test')
    })

    expect(mockOnSearch).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('calls onSearch after custom debounce delay', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() =>
      useSearch({ onSearch: mockOnSearch, debounceMs: 500 })
    )

    act(() => {
      result.current.updateQuery('test')
    })

    expect(mockOnSearch).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('debounces multiple rapid updates', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() => useSearch({ onSearch: mockOnSearch }))

    act(() => {
      result.current.updateQuery('t')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    act(() => {
      result.current.updateQuery('te')
    })

    act(() => {
      jest.advanceTimersByTime(100)
    })

    act(() => {
      result.current.updateQuery('test')
    })

    expect(mockOnSearch).not.toHaveBeenCalled()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockOnSearch).toHaveBeenCalledTimes(1)
    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  it('calls onSearch immediately on mount with empty query', () => {
    const mockOnSearch = jest.fn()
    renderHook(() => useSearch({ onSearch: mockOnSearch }))

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockOnSearch).toHaveBeenCalledWith('')
  })

  it('calls onSearch when query is cleared', () => {
    const mockOnSearch = jest.fn()
    const { result } = renderHook(() => useSearch({ onSearch: mockOnSearch }))

    act(() => {
      result.current.updateQuery('test')
    })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    mockOnSearch.mockClear()

    act(() => {
      result.current.clearQuery()
    })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(mockOnSearch).toHaveBeenCalledWith('')
  })
})
