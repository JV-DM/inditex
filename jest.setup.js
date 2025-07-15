import '@testing-library/jest-dom'

// Suppress console errors in tests for expected error scenarios
const originalConsoleError = console.error
beforeEach(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Error fetching phones:') ||
        args[0].includes('act(...)') ||
        args[0].includes('non-boolean attribute'))
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
})

afterEach(() => {
  console.error = originalConsoleError
})
