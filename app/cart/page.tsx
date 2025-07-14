'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '../../contexts/CartContext'
import styles from './page.module.scss'

const CartPage = () => {
  const { cart } = useCart()
  const router = useRouter()

  const handleContinueShopping = useCallback(() => {
    router.push('/')
  }, [router])


  if (cart.items.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <h1 className={styles.title}>Your Cart is Empty</h1>
          <p className={styles.emptyMessage}>Add some phones to your cart to see them here.</p>
          <button 
            onClick={handleContinueShopping}
            className={styles.continueButton}
            type="button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>CART ({cart.totalItems})</h1>
      
      <div className={styles.cartContent}>
        {cart.items.map((item) => {
          const totalPrice = (item.basePrice + item.selectedStorage.price) * item.quantity
          
          return (
            <div key={`${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`} className={styles.cartItem}>
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
                <p className={styles.itemSpecs}>{item.selectedStorage.capacity} | {item.selectedColor.name.toUpperCase()}</p>
                <p className={styles.itemPrice}>{totalPrice} EUR</p>
                <p className={styles.errorMessage}>Error</p>
              </div>
            </div>
          )
        })}
        
        <div className={styles.cartActions}>
          <button 
            onClick={handleContinueShopping}
            className={styles.continueButton}
            type="button"
          >
            CONTINUE SHOPPING
          </button>
          
          <div className={styles.checkout}>
            <div className={styles.total}>
              <span className={styles.totalLabel}>TOTAL</span>
              <span className={styles.totalPrice}>{cart.totalPrice} EUR</span>
            </div>
            <button className={styles.payButton} type="button">
              PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage