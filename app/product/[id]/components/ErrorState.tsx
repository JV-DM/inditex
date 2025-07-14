import { memo } from 'react'
import { PRODUCT_DETAIL_CONSTANTS } from '../constants'
import styles from '../page.module.scss'

type ErrorStateProps = {
  error?: string | null
}

const ErrorState = memo<ErrorStateProps>(({ error }) => {
  return (
    <div className={styles.error}>
      <h2>{PRODUCT_DETAIL_CONSTANTS.ERROR_TITLE}</h2>
      <p>{error || PRODUCT_DETAIL_CONSTANTS.ERROR_MESSAGE}</p>
    </div>
  )
})

ErrorState.displayName = 'ErrorState'

export default ErrorState