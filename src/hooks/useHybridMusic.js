"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { hybridMusicService } from "../services/hybridMusicService";

export function useHybridMusic() {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [serviceStatus, setServiceStatus] = useState(null);

  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const status = hybridMusicService.getStatus();
    setServiceStatus(status);
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

        console.log("🔍 Hybrid search for:", query);
        const results = await hybridMusicService.searchTracks(query, 20);

        if (abortControllerRef.current.signal.aborted) {
          return;
        }

        console.log(`✅ Hybrid search complete: ${results.length} tracks`);
        setSearchResults(results);

        const status = hybridMusicService.getStatus();
        setServiceStatus(status);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Hybrid search error:", err);
          setError(err.message);
          setSearchResults([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 600);
  }, []);

  const getPopular = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log("🔥 Getting popular hybrid tracks");
      const results = await hybridMusicService.getPopularTracks();
      setSearchResults(results);

      const status = hybridMusicService.getStatus();
      setServiceStatus(status);
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
        console.log("🎭 Getting hybrid tracks for genre:", genre);
        const results = await hybridMusicService.getTracksByGenre(genre);
        setSearchResults(results);

        const status = hybridMusicService.getStatus();
        setServiceStatus(status);
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
    hybridMusicService.clearCache();
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
    serviceStatus,
  };
}
