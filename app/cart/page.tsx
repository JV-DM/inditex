'use client'

import React from 'react'
import { useCart } from '../../contexts/CartContext'
import { useCartPage } from '../../hooks/useCartPage'
import { CartItem } from '../../components/CartItem'
import { Snackbar } from '../../components/Snackbar'
import { Loading } from '../../components/Loading'
import type { CartItem as CartItemType } from '../../types/cart'
import styles from './page.module.scss'

const CartPage: React.FC = () => {
  const { removeFromCart, updateQuantity } = useCart()
  const {
    cart,
    isLoading,
    paymentStatus,
    snackbar,
    hideSnackbar,
    handleContinueShopping,
    handleCheckout,
  } = useCartPage()

  const handleItemQuantityChange = (
    item: CartItemType,
    newQuantity: number
  ) => {
    const uniqueId = `${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`
    updateQuantity(uniqueId, newQuantity)
  }

  const handleItemRemove = (item: CartItemType) => {
    const uniqueId = `${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`
    removeFromCart(uniqueId)
  }

  const isEmptyCart = cart.items.length === 0
  const totalPrice = cart.totalPrice || 0
  const totalItems = cart.totalItems || 0

  return (
    <div className={styles.container}>
      {isLoading && <Loading overlay text='Processing order...' />}

      <h1 className={styles.title}>CART ({totalItems})</h1>

      <div className={styles.cartContent}>
        {cart.items.map(item => (
          <CartItem
            key={`${item.id}-${item.selectedStorage.capacity}-${item.selectedColor.hexCode}`}
            item={item}
            onQuantityChange={handleItemQuantityChange}
            onRemove={handleItemRemove}
            readonly={isLoading}
          />
        ))}
      </div>

      <div className={styles.cartActions}>
        <button
          onClick={handleContinueShopping}
          className={styles.continueButton}
          type='button'
          disabled={isLoading}
        >
          CONTINUE SHOPPING
        </button>

        <div className={styles.checkout}>
          <div className={styles.total}>
            <span className={styles.label}>TOTAL</span>
            <span className={styles.label}>{totalPrice} EUR</span>
          </div>
          <button
            className={`${styles.payButton} ${paymentStatus === 'processing' ? styles.processing : ''}`}
            type='button'
            onClick={handleCheckout}
            disabled={
              isLoading || paymentStatus === 'processing' || isEmptyCart
            }
          >
            {paymentStatus === 'processing' ? 'PROCESSING...' : 'PAY'}
          </button>
          <div className={styles.buttonRow}>
            <button
              onClick={handleContinueShopping}
              className={styles.continueButton}
              type='button'
              disabled={isLoading}
            >
              CONTINUE SHOPPING
            </button>
            <button
              className={`${styles.payButton} ${paymentStatus === 'processing' ? styles.processing : ''}`}
              type='button'
              onClick={handleCheckout}
              disabled={
                isLoading || paymentStatus === 'processing' || isEmptyCart
              }
            >
              {paymentStatus === 'processing' ? 'PROCESSING...' : 'PAY'}
            </button>
          </div>
        </div>
      </div>

      <Snackbar snackbar={snackbar} onClose={hideSnackbar} />
    </div>
  )
}

CartPage.displayName = 'CartPage'

export default CartPage
