import React from 'react'
import styles from './Loading.module.scss'

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  overlay?: boolean
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  text = 'Loading...',
  overlay = false,
}) => {
  const className = `${styles.loading} ${styles[size]} ${overlay ? styles.overlay : ''}`

  return (
    <div className={className}>
      <div className={styles.spinner} />
      {text && <span className={styles.text}>{text}</span>}
    </div>
  )
}
