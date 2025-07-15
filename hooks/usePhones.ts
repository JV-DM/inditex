import { useState, useEffect, useCallback, useRef } from 'react'
import { productsApi } from '../services/api'
import type { ProductListEntity } from '../types/api'
import { MAX_PHONES } from './constants'

export const usePhones = () => {
  const [phones, setPhones] = useState<ProductListEntity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasInitialFetch = useRef(false)

  const fetchPhones = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      setError(null)

      const data = await productsApi.getProducts({
        search,
        limit: MAX_PHONES,
      })

      // Remove duplicates based on ID
      const uniquePhones = data.filter(
        (phone, index, self) => index === self.findIndex(p => p.id === phone.id)
      )

      setPhones(uniquePhones)
    } catch (err) {
      console.error(
        'Error fetching phones:',
        err,
        process.env,
        process.env.PUBLIC_API_BASE_URL
      )
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
    if (!hasInitialFetch.current) {
      hasInitialFetch.current = true
      fetchPhones()
    }
  }, [fetchPhones])

  return {
    phones,
    loading,
    error,
    fetchPhones,
    retryFetch,
  }
}
