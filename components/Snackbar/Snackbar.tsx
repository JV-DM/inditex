import React from 'react'
import type { SnackbarState } from '../../hooks/useSnackbar'
import styles from './Snackbar.module.scss'

interface SnackbarProps {
  snackbar: SnackbarState
  onClose: () => void
}

export const Snackbar: React.FC<SnackbarProps> = ({ snackbar, onClose }) => {
  if (!snackbar.isVisible) return null

  return (
    <div className={`${styles.snackbar} ${styles[snackbar.type]}`}>
      <span className={styles.message}>{snackbar.message}</span>
      <button
        className={styles.closeButton}
        onClick={onClose}
        type='button'
        aria-label='Close notification'
      >
        ×
      </button>
    </div>
  )
}
