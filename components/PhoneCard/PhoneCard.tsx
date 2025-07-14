'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '../../contexts/CartContext'
import type { ProductListEntity } from '../../types/api'
import styles from './PhoneCard.module.scss'

type PhoneCardProps = {
  phone: ProductListEntity
}

export const PhoneCard = ({ phone }: PhoneCardProps) => {
  const { addToCart } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: phone.id,
      name: phone.name,
      brand: phone.brand,
      basePrice: phone.basePrice,
      imageUrl: phone.imageUrl,
    })
  }

  return (
    <Link href={`/product/${phone.id}`}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={phone.imageUrl}
            alt={phone.name}
            fill
            className={styles.image}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>

        <div className={styles.content}>
          <p className={styles.brand}>{phone.brand}</p>
          <h3 className={styles.name}>{phone.name}</h3>

          <div className={styles.footer}>
            <span className={styles.price}>
              €{phone.basePrice.toLocaleString()}
            </span>

            <button onClick={handleAddToCart} className={styles.addButton}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
