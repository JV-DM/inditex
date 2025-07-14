import type {
  ProductListEntity,
  ProductEntity,
  ErrorEntity,
  GetProductsProps,
} from '../types/api'

const API_BASE_URL =
  process.env.PUBLIC_API_BASE_URL ||
  'https://prueba-tecnica-api-tienda-moviles.onrender.com'

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
      'x-api-key':
        process.env.PUBLIC_API_KEY || '87909682e6cd74208f41a6ef39fe4191',
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorData: ErrorEntity = await response.json()
    throw new ApiError(response.status, errorData)
  }

  return response.json()
}

export const productsApi = {
  getProducts: async (
    props?: GetProductsProps
  ): Promise<ProductListEntity[]> => {
    const params = new URLSearchParams()
    if (props?.search) params.append('search', props.search)
    if (props?.limit) params.append('limit', props.limit.toString())
    if (props?.offset) params.append('offset', props.offset.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `/products?${queryString}` : '/products'

    return fetchApi<ProductListEntity[]>(endpoint)
  },

  getProduct: async (id: string): Promise<ProductEntity> => {
    return fetchApi<ProductEntity>(`/products/${id}`)
  },
}

export { ApiError }
export type { ProductListEntity, ProductEntity, ErrorEntity }
