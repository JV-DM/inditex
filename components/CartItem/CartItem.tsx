import React from 'react'
import Image from 'next/image'
import type { CartItem as CartItemType } from '../../types/cart'
import styles from './CartItem.module.scss'

interface CartItemProps {
  item: CartItemType
  onQuantityChange?: (item: CartItemType, newQuantity: number) => void
  onRemove?: (item: CartItemType) => void
  readonly?: boolean
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemove,
  readonly = false
}) => {
  const totalPrice = (item.basePrice + item.selectedStorage.price) * item.quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (onQuantityChange && newQuantity > 0) {
      onQuantityChange(item, newQuantity)
    }
  }

  const handleRemove = () => {
    if (onRemove) {
      onRemove(item)
    }
  }

  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        <Image
          src={item.selectedColor.imageUrl}
          alt={item.name}
          width={200}
          height={240}
          className={styles.image}
        />
      </div>
      
      <div className={styles.itemDetails}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemSpecs}>
          {item.selectedStorage.capacity} | {item.selectedColor.name.toUpperCase()}
        </p>
        <p className={styles.itemPrice}>{totalPrice} EUR</p>
        
        {!readonly && (
          <div className={styles.itemActions}>
            <div className={styles.quantityControls}>
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                className={styles.quantityButton}
                type="button"
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className={styles.quantity}>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                className={styles.quantityButton}
                type="button"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleRemove}
              className={styles.removeButton}
              type="button"
              aria-label={`Remove ${item.name} from cart`}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}