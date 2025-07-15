'use server'

import type {
  ProductListEntity,
  ProductEntity,
  ErrorEntity,
  GetProductsProps,
} from '../types/api'

const API_BASE_URL = process.env.PUBLIC_API_BASE_URL || ''
const API_KEY = process.env.PUBLIC_API_KEY || ''

class ApiError extends Error {
  constructor(
    public status: number,
    public data: ErrorEntity
  ) {
    super(data.message)
    this.name = 'ApiError'
  }
}

const fetchApi = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData: ErrorEntity = await response.json()
    throw new ApiError(response.status, errorData)
  }

  return response.json()
}

export async function getProducts(
  props?: GetProductsProps
): Promise<ProductListEntity[]> {
  const params = new URLSearchParams()
  if (props?.search) params.append('search', props.search)
  if (props?.limit) params.append('limit', props.limit.toString())
  if (props?.offset) params.append('offset', props.offset.toString())

  const queryString = params.toString()
  const endpoint = queryString ? `/products?${queryString}` : '/products'

  return fetchApi<ProductListEntity[]>(endpoint)
}

export async function getProduct(id: string): Promise<ProductEntity> {
  return fetchApi<ProductEntity>(`/products/${id}`)
}
