"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchYouTubeVideos,
  convertYouTubeToTrack,
} from "../utils/youtube-api";
import { useSearch } from "../redux/hooks/useRedux";

export function useYouTubeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const { updateSearchResults } = useSearch();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["youtube-search", searchQuery],
    queryFn: () => searchYouTubeVideos(searchQuery),
    enabled: searchQuery.length > 2,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const search = useCallback(
    async (query) => {
      setSearchQuery(query);
      if (query.length > 2) {
        try {
          const response = await refetch();
          if (response.data && response.data.items) {
            const tracks = response.data.items.map((video, index) =>
              convertYouTubeToTrack(video, index)
            );
            updateSearchResults(tracks);
            return tracks;
          }
        } catch (error) {
          console.error("Search error:", error);
          updateSearchResults([]);
        }
      } else {
        updateSearchResults([]);
      }
    },
    [refetch, updateSearchResults]
  );

  return {
    search,
    searchResults: data?.items?.map(convertYouTubeToTrack) || [],
    isLoading,
    error,
    searchQuery,
  };
}
