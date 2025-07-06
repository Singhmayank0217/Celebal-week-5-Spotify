"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { universalMusicService } from "../services/universalMusicService";

export function useOptimizedMusic() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  const searchTimeoutRef = useRef(null);
  const lastSearchRef = useRef("");
  const abortControllerRef = useRef(null);

  const search = useCallback(async (query) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!query || query.length < 2) {
      setSearchResults([]);
      setSearchQuery("");
      setIsLoading(false);
      return;
    }

    if (query === lastSearchRef.current) {
      return;
    }

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();
        lastSearchRef.current = query;

        console.log("🎵 Searching for:", query);
        const results = await universalMusicService.searchTracks(query, 20);

        if (abortControllerRef.current.signal.aborted) {
          return;
        }

        console.log(`✅ Found ${results.length} playable tracks`);
        setSearchResults(results);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Search error:", err);
          setError(err.message);
          setSearchResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, []);

  const getPopular = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const results = await universalMusicService.getPopularTracks();
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const getGenreTracks = useCallback(
    async (genre) => {
      if (isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const results = await universalMusicService.getTracksByGenre(genre);
        setSearchResults(results);
      } catch (err) {
        setError(err.message);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );

  const cleanup = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    universalMusicService.clearCache();
  }, []);

  return useMemo(
    () => ({
      search,
      getPopular,
      getGenreTracks,
      cleanup,
      searchResults,
      isLoading,
      searchQuery,
      error,
    }),
    [
      search,
      getPopular,
      getGenreTracks,
      cleanup,
      searchResults,
      isLoading,
      searchQuery,
      error,
    ]
  );
}
