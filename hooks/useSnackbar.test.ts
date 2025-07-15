import { renderHook, act } from '@testing-library/react'
import { useSnackbar } from './useSnackbar'

jest.useFakeTimers()

describe('useSnackbar', () => {
  beforeEach(() => {
    jest.clearAllTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    jest.useFakeTimers()
  })

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useSnackbar())

    expect(result.current.snackbar).toEqual({
      isVisible: false,
      message: '',
      type: 'info'
    })
  })

  it('shows snackbar with default type', () => {
    const { result } = renderHook(() => useSnackbar())

    act(() => {
      result.current.showSnackbar('Test message')
    })

    expect(result.current.snackbar).toEqual({
      isVisible: true,
      message: 'Test message',
      type: 'info'
    })
  })

  it('shows snackbar with custom type', () => {
    const { result } = renderHook(() => useSnackbar())

    act(() => {
      result.current.showSnackbar('Error message', 'error')
    })

    expect(result.current.snackbar).toEqual({
      isVisible: true,
      message: 'Error message',
      type: 'error'
    })
  })

  it('hides snackbar when hideSnackbar is called', () => {
    const { result } = renderHook(() => useSnackbar())

    act(() => {
      result.current.showSnackbar('Test message')
    })

    expect(result.current.snackbar.isVisible).toBe(true)

    act(() => {
      result.current.hideSnackbar()
    })

    expect(result.current.snackbar.isVisible).toBe(false)
  })

  it('auto-hides snackbar after default duration', () => {
    const { result } = renderHook(() => useSnackbar())

    act(() => {
      result.current.showSnackbar('Test message')
    })

    expect(result.current.snackbar.isVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(4000)
    })

    expect(result.current.snackbar.isVisible).toBe(false)
  })

  it('auto-hides snackbar after custom duration', () => {
    const { result } = renderHook(() => useSnackbar(2000))

    act(() => {
      result.current.showSnackbar('Test message')
    })

    expect(result.current.snackbar.isVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(2000)
    })

    expect(result.current.snackbar.isVisible).toBe(false)
  })

  it('does not auto-hide when autoHideDuration is 0', () => {
    const { result } = renderHook(() => useSnackbar(0))

    act(() => {
      result.current.showSnackbar('Test message')
    })

    expect(result.current.snackbar.isVisible).toBe(true)

    act(() => {
      jest.advanceTimersByTime(10000)
    })

    expect(result.current.snackbar.isVisible).toBe(true)
  })

  it('clears timer when snackbar is manually hidden', () => {
    const { result } = renderHook(() => useSnackbar())

    act(() => {
      result.current.showSnackbar('Test message')
    })

    act(() => {
      result.current.hideSnackbar()
    })

    expect(result.current.snackbar.isVisible).toBe(false)

    act(() => {
      jest.advanceTimersByTime(4000)
    })

    expect(result.current.snackbar.isVisible).toBe(false)
  })
})