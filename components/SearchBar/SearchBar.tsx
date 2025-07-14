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
        <div className={styles.searchIcon}>
          <span>🔍</span>
        </div>

        <input
          type='text'
          value={query}
          onChange={e => updateQuery(e.target.value)}
          placeholder='Search phones by name or brand...'
          className={styles.input}
        />

        {isLoading && (
          <div className={styles.spinner}>
            <div className={styles.spinnerIcon}></div>
          </div>
        )}
      </div>

      <div className={styles.results}>
        {query && !isLoading && (
          <span>
            {resultsCount} {resultsCount === 1 ? 'result' : 'results'} found
            {query && ` for "${query}"`}
          </span>
        )}
        {!query && !isLoading && <span>Showing all phones</span>}
      </div>
    </div>
  )
}
