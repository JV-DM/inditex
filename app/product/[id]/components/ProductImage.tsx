import Image from 'next/image'
import { memo } from 'react'
import type { ProductImageProps } from '../types'
import styles from '../page.module.scss'

const ProductImage = memo<ProductImageProps>(({ src, alt, className }) => {
  return (
    <div className={styles.imageSection}>
      <div className={styles.imageContainer}>
        <Image
          src={src}
          alt={alt}
          fill
          className={`${styles.productImage} ${className || ''}`}
          sizes='(max-width: 768px) 100vw, 50vw'
          priority
        />
      </div>
    </div>
  )
})

ProductImage.displayName = 'ProductImage'

export default ProductImage
