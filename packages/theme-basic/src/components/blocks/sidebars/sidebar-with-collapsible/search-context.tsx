'use client'
import { createContext, useContext, useState, ReactNode, useMemo } from 'react'

interface SearchContextValue {
  /** Current search query */
  searchQuery: string
  /** Update search query */
  setSearchQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

interface SearchProviderProps {
  children: ReactNode
}

/**
 * Provider for sidebar search functionality.
 * Allows SearchField to update the query and NavLinks to filter based on it.
 */
export const SearchProvider = ({ children }: SearchProviderProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
    }),
    [searchQuery]
  )

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
}

/**
 * Hook to access search context
 */
export const useSearch = (): SearchContextValue => {
  const context = useContext(SearchContext)
  if (!context) {
    // Return a no-op context if not within provider (for backwards compatibility)
    return {
      searchQuery: '',
      setSearchQuery: () => {},
    }
  }
  return context
}
