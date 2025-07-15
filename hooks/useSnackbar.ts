import { useState, useEffect, useCallback } from 'react'

export interface SnackbarState {
  isVisible: boolean
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export interface UseSnackbarReturn {
  snackbar: SnackbarState
  showSnackbar: (message: string, type?: SnackbarState['type']) => void
  hideSnackbar: () => void
}

export const useSnackbar = (autoHideDuration = 4000): UseSnackbarReturn => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    isVisible: false,
    message: '',
    type: 'info',
  })

  const showSnackbar = useCallback(
    (message: string, type: SnackbarState['type'] = 'info') => {
      setSnackbar({
        isVisible: true,
        message,
        type,
      })
    },
    []
  )

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({
      ...prev,
      isVisible: false,
    }))
  }, [])

  useEffect(() => {
    if (snackbar.isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        hideSnackbar()
      }, autoHideDuration)

      return () => clearTimeout(timer)
    }
  }, [snackbar.isVisible, autoHideDuration, hideSnackbar])

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
  }
}
