'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../../contexts/CartContext'
import { useLoading } from '../../contexts/LoadingContext'
import styles from './Navigation.module.scss'

export const Navigation = () => {
  const { cart } = useCart()

  return (
    <nav className={`${styles.nav}`}>
      <div className={styles.container}>
        <Link href='/' className={styles.brand}>
          <Image src='/logo.svg' alt='Logo' width={74} height={24} />
        </Link>

        <div className={styles.actions}>
          <Link href='/cart' className={styles.cartLink}>
            <Image src='/cart.svg' alt='Cart' width={18} height={18} />
            <span>{cart.totalItems}</span>
            {/* Update style of total items */}
          </Link>
        </div>
      </div>
    </nav>
  )
}
