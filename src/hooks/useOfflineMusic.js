"use client"

import { useState, useCallback } from "react"
import { searchMockTracks, getPopularTracks, getTracksByGenre } from "../data/mockMusic"

export function useOfflineMusic() {
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const search = useCallback((query) => {
    setSearchQuery(query)
    setIsLoading(true)

    setTimeout(() => {
      const results = searchMockTracks(query)
      setSearchResults(results)
      setIsLoading(false)
    }, 300)
  }, [])

  const getPopular = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      const results = getPopularTracks()
      setSearchResults(results)
      setIsLoading(false)
    }, 200)
  }, [])

  const getGenreTracks = useCallback((genre) => {
    setIsLoading(true)
    setTimeout(() => {
      const results = getTracksByGenre(genre)
      setSearchResults(results)
      setIsLoading(false)
    }, 200)
  }, [])

  return {
    search,
    getPopular,
    getGenreTracks,
    searchResults,
    isLoading,
    searchQuery,
  }
}
