"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { youtubeSearchService } from "../services/youtubeSearchService";

export function useYouTubeMusic() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const status = youtubeSearchService.getStatus();
    setApiStatus(status);
  }, []);

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

    setSearchQuery(query);
    setIsLoading(true);
    setError(null);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        abortControllerRef.current = new AbortController();

        console.log("🎵 Searching YouTube for:", query);
        const results = await youtubeSearchService.searchMusic(query, 20);

        if (abortControllerRef.current.signal.aborted) {
          return;
        }

        console.log(`✅ Found ${results.length} YouTube tracks`);
        setSearchResults(results);

        const status = youtubeSearchService.getStatus();
        setApiStatus(status);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("YouTube search error:", err);
          setError(err.message);
          setSearchResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, []);

  const getPopular = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔥 Getting popular YouTube music");
      const results = await youtubeSearchService.getPopularMusic();
      setSearchResults(results);

      const status = youtubeSearchService.getStatus();
      setApiStatus(status);
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
        console.log("🎭 Getting YouTube music for genre:", genre);
        const results = await youtubeSearchService.getMusicByGenre(genre);
        setSearchResults(results);

        const status = youtubeSearchService.getStatus();
        setApiStatus(status);
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
    youtubeSearchService.clearCache();
  }, []);

  return {
    search,
    getPopular,
    getGenreTracks,
    cleanup,
    searchResults,
    isLoading,
    searchQuery,
    error,
    apiStatus,
  };
}
