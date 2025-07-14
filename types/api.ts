export type ErrorEntity = {
  error: string
  message: string
}

export type ProductListEntity = {
  id: string
  brand: string
  name: string
  basePrice: number
  imageUrl: string
}

export type ColorOption = {
  [key: string]: any
}

export type StorageOption = {
  [key: string]: any
}

export type SimilarProduct = {
  [key: string]: any
}

export type ProductSpecs = {
  [key: string]: any
}

export type ProductEntity = {
  id: string
  brand: string
  name: string
  description: string
  basePrice: number
  rating: number
  specs: ProductSpecs
  colorOptions: ColorOption[]
  storageOptions: StorageOption[]
  similarProducts: SimilarProduct[]
}

export type GetProductsProps = {
  search?: string
  limit?: number
  offset?: number
}
