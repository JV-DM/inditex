'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePhones } from '../../hooks/usePhones'
import { useSnackbar } from '../../hooks/useSnackbar'
import { PhoneCard } from '../PhoneCard'
import { SearchBar } from '../SearchBar'
import { Snackbar } from '../Snackbar'
import styles from './PhonesList.module.scss'

export const PhonesList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const { phones, loading, error, fetchPhones, retryFetch } = usePhones()
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar()

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      fetchPhones(query || undefined)
    },
    [fetchPhones]
  )

  useEffect(() => {
    if (error) {
      showSnackbar(error, 'error')
    }
  }, [error, showSnackbar])

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
      
      <Snackbar snackbar={snackbar} onClose={hideSnackbar} />
    </div>
  )
}
