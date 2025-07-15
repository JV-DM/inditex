import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '../services/api'
import type { ProductEntity } from '../types/api'

type UseProductDetailReturn = {
  product: ProductEntity | null
  loading: boolean
  error: string | null
  refetch: () => void
}

type UseProductDetailOptions = {
  productId: string | null
  enabled?: boolean
}

export const useProductDetail = ({
  productId,
  enabled = true,
}: UseProductDetailOptions): UseProductDetailReturn => {
  const [product, setProduct] = useState<ProductEntity | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = useCallback(async () => {
    if (!productId || !enabled) return

    try {
      setLoading(true)
      setError(null)

      const productData = await productsApi.getProduct(productId)
      setProduct(productData)
    } catch (err) {
      console.error('Error fetching product:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load product details'
      )
    } finally {
      setLoading(false)
    }
  }, [productId, enabled])

  const refetch = useCallback(() => {
    fetchProduct()
  }, [fetchProduct])

  useEffect(() => {
    fetchProduct()
  }, [fetchProduct])

  return {
    product,
    loading,
    error,
    refetch,
  }
}
