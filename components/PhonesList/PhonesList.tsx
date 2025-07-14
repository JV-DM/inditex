'use client'

import { useState, useCallback } from 'react'
import { usePhones } from '../../hooks/usePhones'
import { PhoneCard } from '../PhoneCard'
import { SearchBar } from '../SearchBar'
import styles from './PhonesList.module.scss'

export const PhonesList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { phones, loading, error, fetchPhones, retryFetch } = usePhones()

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      fetchPhones(query || undefined)
    },
    [fetchPhones]
  )

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Something went wrong</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button
            onClick={() => retryFetch(searchQuery)}
            className={styles.retryButton}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBar
          onSearch={handleSearch}
          resultsCount={phones.length}
          isLoading={loading}
        />
      </div>

      {loading && phones.length === 0 ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className={styles.loadingSkeleton} />
          ))}
        </div>
      ) : phones.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>📱</div>
          <h2 className={styles.emptyTitle}>No phones found</h2>
          <p className={styles.emptyMessage}>
            {searchQuery
              ? `No phones match "${searchQuery}". Try a different search term.`
              : 'No phones available at the moment.'}
          </p>
        </div>
      ) : (
        <div className={styles.phonesGrid}>
          {phones.map((phone, index) => (
            <PhoneCard key={`${phone.id}-${index}`} phone={phone} />
          ))}
        </div>
      )}
    </div>
  )
}
