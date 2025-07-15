import type { StorageOption, ColorOption } from '../../../types/api'

export type ProductSelections = {
  storage: StorageOption
  color: ColorOption
}

export type ProductDetailPageProps = {
  params: {
    id: string
  }
}

export type ProductImageProps = {
  src: string
  alt: string
  className?: string
}

export type ProductOptionsProps = {
  storageOptions?: StorageOption[]
  colorOptions?: ColorOption[]
  selectedStorage: StorageOption
  selectedColor: ColorOption
  onStorageChange: (storage: StorageOption) => void
  onColorChange: (color: ColorOption) => void
  onAddToCart: () => void
  disabled?: boolean
}

export type ProductInfoProps = {
  name: string
  basePrice: number
  selectedStoragePrice: number
}
