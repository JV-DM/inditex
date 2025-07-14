import { memo } from 'react'
import { PRODUCT_DETAIL_CONSTANTS } from '../constants'
import styles from '../page.module.scss'

const LoadingState = memo(() => {
  return (
    <div className={styles.loading}>
      {PRODUCT_DETAIL_CONSTANTS.LOADING_TEXT}
    </div>
  )
})

LoadingState.displayName = 'LoadingState'

export default LoadingState