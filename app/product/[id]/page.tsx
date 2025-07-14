'use client'

import { useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '../../../contexts/CartContext'
import { useProductDetail } from '../../../hooks/useProductDetail'
import { useProductOptions } from '../../../hooks/useProductOptions'
import { PRODUCT_DETAIL_CONSTANTS } from './constants'
import { getProductImageUrl } from './utils'
import type { ProductSelections } from './types'
import ProductImage from './components/ProductImage'
import ProductOptions from './components/ProductOptions'
import ProductInfo from './components/ProductInfo'
import LoadingState from './components/LoadingState'
import ErrorState from './components/ErrorState'
import styles from './page.module.scss'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()

  const { product, loading, error } = useProductDetail({
    productId: params.id as string,
  })

  const {
    selectedStorage,
    selectedColor,
    setSelectedStorage,
    setSelectedColor,
    isValidSelection,
    isInitialized,
  } = useProductOptions({
    product,
    onSelectionChange: useCallback((selections: ProductSelections) => {
      // Handle selection changes if needed
      console.log('Selection changed:', selections)
    }, []),
  })

  const handleAddToCart = useCallback(() => {
    if (product && isValidSelection && selectedStorage && selectedColor) {
      addToCart({
        id: product.id,
        name: product.name,
        brand: product.brand,
        basePrice: product.basePrice,
        imageUrl: getProductImageUrl(product.id),
        selectedStorage: {
          capacity: selectedStorage.capacity,
          price: selectedStorage.price,
        },
        selectedColor: {
          hexCode: selectedColor.hexCode,
          name: selectedColor.name,
          imageUrl: selectedColor.imageUrl,
        },
      })
    }
  }, [product, isValidSelection, selectedStorage, selectedColor, addToCart])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  if (loading || !isInitialized) {
    return (
      <div className={styles.container}>
        <LoadingState />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className={styles.container}>
        <ErrorState error={error} />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <button onClick={handleBack} className={styles.backButton} type='button'>
        {PRODUCT_DETAIL_CONSTANTS.BACK_BUTTON_TEXT}
      </button>

      <div className={styles.productLayout}>
        <ProductImage src={selectedColor.imageUrl} alt={product.name} />
        <div className={styles.detailsSection}>
          <ProductInfo
            name={product.name}
            basePrice={product.basePrice}
            selectedStoragePrice={selectedStorage?.price || 0}
          />
          <ProductOptions
            storageOptions={product.storageOptions}
            colorOptions={product.colorOptions}
            selectedStorage={selectedStorage}
            selectedColor={selectedColor}
            onStorageChange={setSelectedStorage}
            onColorChange={setSelectedColor}
            onAddToCart={handleAddToCart}
            disabled={!isValidSelection}
          />
        </div>
      </div>

      <div className={styles.specificationsSection}>
        <h2 className={styles.specificationsTitle}>
          {PRODUCT_DETAIL_CONSTANTS.SPECIFICATIONS_TITLE}
        </h2>
        {product.description && (
          <div className={styles.specifications}>
            <p>{product.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
