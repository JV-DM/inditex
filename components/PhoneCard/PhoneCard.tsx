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
      selectedStorage: {
        capacity: '',
        price: 0,
      },
      selectedColor: {
        hexCode: '',
        name: '',
        imageUrl: '',
      },
    })
  }

  return (
    <Link href={`/product/${phone.id}`} className={styles.cardContainer}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <Image
            src={phone.imageUrl}
            alt={phone.name}
            fill
            className={styles.image}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw'
          />
        </div>

        <div className={styles.content}>
          <div className={styles.info}>
            <p className={styles.brand}>{phone.brand}</p>
            <h3 className={styles.name}>{phone.name}</h3>
          </div>

          <div className={styles.priceContainer}>
            <span className={styles.price}>{phone.basePrice} EUR</span>
          </div>
        </div>

        <div className={styles.hoverOverlay}></div>
      </div>
    </Link>
  )
}
