import { useState, useEffect } from 'react'

type UseSearchProps = {
  onSearch: (query: string) => void
  debounceMs?: number
}

export const useSearch = ({ onSearch, debounceMs = 300 }: UseSearchProps) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query)
    }, debounceMs)

    return () => clearTimeout(timeoutId)
  }, [query, onSearch, debounceMs])

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery)
  }

  const clearQuery = () => {
    setQuery('')
  }

  return {
    query,
    updateQuery,
    clearQuery,
  }
}