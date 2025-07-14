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
  hexCode: string
  name: string
  imageUrl: string
}

export type StorageOption = {
  capacity: string
  price: number
}

export type SimilarProduct = {
  id: string
  name: string
  imageUrl: string
  price: number
}

export type ProductSpecs = {
  screen: string
  processor: string
  memory: string
  storage: string
  camera: string
  battery: string
  os: string
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
