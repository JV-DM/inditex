'use client'

import { useSearch } from '@/hooks/useSearch'
import styles from './SearchBar.module.scss'


type SearchBarProps = {
  onSearch: (query: string) => void
  resultsCount: number
  isLoading?: boolean
}

export const SearchBar = ({
  onSearch,
  resultsCount,
  isLoading,
}: SearchBarProps) => {
  const { query, updateQuery } = useSearch({ onSearch })

  return (
    <div className={styles.container}>
      <div className={styles.inputContainer}>
        <input
          type='text'
          value={query}
          onChange={e => updateQuery(e.target.value)}
          placeholder='Search for a smartphone...'
          className={styles.input}
        />

        {isLoading && (
          <div className={styles.spinner}>
            <div className={styles.spinnerIcon}></div>
          </div>
        )}
      </div>

      <div className={styles.results}>
        <span>{resultsCount} RESULTS</span>
      </div>
    </div>
  )
}
