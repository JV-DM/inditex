import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '../services/api'
import type { ProductListEntity } from '../types/api'

export const usePhones = () => {
  const [phones, setPhones] = useState<ProductListEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPhones = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const data = await productsApi.getProducts({
        search,
        limit: 20,
      })

      // Remove duplicates based on ID
      const uniquePhones = data.filter(
        (phone, index, self) => index === self.findIndex(p => p.id === phone.id)
      )

      setPhones(uniquePhones)
    } catch (err) {
      console.error('Error fetching phones:', err)
      setError('Failed to load phones. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  const retryFetch = useCallback(
    (searchQuery?: string) => {
      fetchPhones(searchQuery || undefined)
    },
    [fetchPhones]
  )

  useEffect(() => {
    fetchPhones()
  }, [fetchPhones])

  return {
    phones,
    loading,
    error,
    fetchPhones,
    retryFetch,
  }
}