'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../../contexts/CartContext'
import styles from './Navigation.module.scss'

export const Navigation = () => {
  const { cart } = useCart()

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href='/' className={styles.brand}>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={74}
              height={24}
            />
        </Link>

        <div className={styles.actions}>
          <Link href='/cart' className={styles.cartLink}>
            <div className={styles.cartButton}>
              <span>CART</span>
            </div>
            {cart.totalItems > 0 && (
              <span className={styles.cartBadge}>{cart.totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  )
}
