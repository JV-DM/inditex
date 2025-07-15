import { memo } from 'react'
import type { ProductOptionsProps } from '../types'
import { PRODUCT_DETAIL_CONSTANTS } from '../constants'
import styles from '../page.module.scss'

const ProductOptions = memo<ProductOptionsProps>(
  ({
    storageOptions,
    colorOptions,
    selectedStorage,
    selectedColor,
    onStorageChange,
    onColorChange,
    onAddToCart,
    disabled = false,
  }) => {
    return (
      <>
        {storageOptions && storageOptions.length > 0 && (
          <div className={styles.optionGroup}>
            <h3 className={styles.optionTitle}>
              {PRODUCT_DETAIL_CONSTANTS.STORAGE_TITLE}
            </h3>
            <div className={styles.optionButtons}>
              {storageOptions.map((storageOption, index) => {
                const { capacity } = storageOption

                return (
                  <button
                    key={`${capacity}-${index}`}
                    onClick={() => onStorageChange(storageOption)}
                    className={`${styles.optionButton} ${
                      selectedStorage.capacity === capacity
                        ? styles.selected
                        : ''
                    }`}
                    type='button'
                  >
                    <span>{capacity}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {colorOptions && colorOptions.length > 0 && (
          <div className={styles.optionGroup}>
            <h3 className={styles.optionTitle}>
              {PRODUCT_DETAIL_CONSTANTS.COLOR_TITLE}
            </h3>
            <div className={styles.colorOptions}>
              {colorOptions.map((color, index) => (
                <button
                  key={`${color.hexCode}-${index}`}
                  onClick={() => onColorChange(color)}
                  className={`${styles.colorButton} ${
                    selectedColor.hexCode === color.hexCode
                      ? styles.selected
                      : ''
                  }`}
                  type='button'
                  aria-label={`Select ${color.hexCode} color`}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: color.hexCode,
                    }}
                  ></div>
                </button>
              ))}
            </div>
            <p className={styles.colorName}>{selectedColor.name}</p>

            <button
              onClick={onAddToCart}
              className={styles.addButton}
              disabled={disabled}
              type='button'
            >
              {PRODUCT_DETAIL_CONSTANTS.ADD_BUTTON_TEXT}
            </button>
          </div>
        )}
      </>
    )
  }
)

ProductOptions.displayName = 'ProductOptions'

export default ProductOptions
