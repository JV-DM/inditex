import { memo } from 'react'
import type { ProductInfoProps } from '../types'
import styles from '../page.module.scss'

const ProductInfo = memo<ProductInfoProps>(
  ({ name, basePrice, selectedStoragePrice }) => {
    const totalPrice = basePrice + selectedStoragePrice
    
    return (
      <div className={styles.productInfo}>
        <h1 className={styles.productName}>{name}</h1>
        <p className={styles.price}>{totalPrice} EUR</p>
      </div>
    )
  }
)

ProductInfo.displayName = 'ProductInfo'

export default ProductInfo
