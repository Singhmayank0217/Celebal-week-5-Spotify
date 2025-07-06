"use client";

import { useState, useEffect, useCallback, memo } from "react";
import { useMusicPlayer, usePlaylists } from "../../redux/hooks/useRedux";
import { useHybridMusic } from "../../hooks/useHybridMusic";
import {
  Search,
  Play,
  Plus,
  Loader2,
  Music2,
  Clock,
  Heart,
  MoreHorizontal,
} from "lucide-react";

const TrackItem = memo(
  ({ track, index, onPlay, onAddToPlaylist, playlists }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handlePlay = useCallback(async () => {
      setIsLoading(true);
      try {
        await onPlay(track);
      } catch (error) {
        console.error("Error playing track:", error);
      } finally {
        setIsLoading(false);
      }
    }, [onPlay, track]);

    return (
      <div
        className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-800 group transition-all duration-200 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div className="w-8 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-green-500" />
          ) : isHovered ? (
            <Play className="h-4 w-4 text-white" />
          ) : (
            <span className="text-gray-400 text-sm">{index + 1}</span>
          )}
        </div>

        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <img
            src={
              track.cover ||
              "https://via.placeholder.com/40x40/1f2937/ffffff?text=♪"
            }
            alt={track.title}
            className="w-10 h-10 rounded object-cover shadow-md"
            loading="lazy"
          />

          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-white text-sm truncate group-hover:text-green-400 transition-colors">
              {track.title}
            </h3>
            <div className="flex items-center space-x-2">
              <p className="text-gray-400 text-xs truncate hover:text-white hover:underline cursor-pointer">
                {track.artist}
              </p>
              {track.explicit && (
                <span className="bg-gray-600 text-white text-xs px-1 rounded">
                  E
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="hidden md:block flex-1 min-w-0">
          <p className="text-gray-400 text-sm truncate hover:text-white hover:underline cursor-pointer">
            {track.album}
          </p>
        </div>

        {track.popularity && (
          <div className="hidden lg:flex items-center space-x-2 w-16">
            <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${track.popularity}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <Heart className="h-4 w-4" />
          </button>

          <div className="relative group/dropdown">
            <button className="text-gray-400 hover:text-white transition-colors p-1">
              <Plus className="h-4 w-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl opacity-0 group-hover/dropdown:opacity-100 transition-opacity z-10 min-w-48 border border-gray-700">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white first:rounded-t-lg last:rounded-b-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist(track, playlist.id);
                  }}
                >
                  Add to {playlist.name}
                </button>
              ))}
            </div>
          </div>

          <button className="text-gray-400 hover:text-white transition-colors p-1">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="w-12 text-right">
          <span className="text-gray-400 text-sm">{track.duration}</span>
        </div>
      </div>
    );
  }
);

TrackItem.displayName = "TrackItem";

export default function SearchView() {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const { playTrack } = useMusicPlayer();
  const { playlists, addTrackToPlaylist } = usePlaylists();
  const { search, searchResults, isLoading, searchQuery, error, cleanup } =
    useHybridMusic();

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchQuery.trim()) {
        search(localSearchQuery);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [localSearchQuery, search]);

  const handlePlayTrack = useCallback(
    async (track) => {
      await playTrack(track);
    },
    [playTrack]
  );

  const handleAddToPlaylist = useCallback(
    (track, playlistId) => {
      addTrackToPlaylist(playlistId, track);
    },
    [addTrackToPlaylist]
  );

  const handleGenreClick = useCallback((genreName) => {
    setLocalSearchQuery(genreName);
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 via-black to-black text-white overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "Taylor Swift",
              "Ed Sheeran",
              "Dua Lipa",
              "The Weeknd",
              "Harry Styles",
              "Olivia Rodrigo",
              "Pop hits",
              "Rock classics",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setLocalSearchQuery(suggestion)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm transition-colors border border-gray-700 hover:border-gray-600"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {localSearchQuery === "" ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Browse all</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[
                {
                  name: "Pop",
                  color: "bg-gradient-to-br from-pink-500 to-purple-600",
                },
                {
                  name: "Hip Hop",
                  color: "bg-gradient-to-br from-orange-500 to-red-600",
                },
                {
                  name: "Rock",
                  color: "bg-gradient-to-br from-red-500 to-pink-600",
                },
                {
                  name: "Electronic",
                  color: "bg-gradient-to-br from-purple-500 to-blue-600",
                },
                {
                  name: "Jazz",
                  color: "bg-gradient-to-br from-blue-500 to-indigo-600",
                },
                {
                  name: "Classical",
                  color: "bg-gradient-to-br from-green-500 to-teal-600",
                },
                {
                  name: "Country",
                  color: "bg-gradient-to-br from-yellow-500 to-orange-600",
                },
                {
                  name: "R&B",
                  color: "bg-gradient-to-br from-indigo-500 to-purple-600",
                },
              ].map((genre) => (
                <div
                  key={genre.name}
                  className={`aspect-square rounded-lg p-4 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform ${genre.color}`}
                  onClick={() => handleGenreClick(genre.name)}
                >
                  <h3 className="text-xl font-bold text-white">{genre.name}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {searchResults.length > 0
                  ? `Results for "${searchQuery}"`
                  : isLoading
                  ? "Searching..."
                  : "No results found"}
              </h2>
              {searchResults.length > 0 && (
                <div className="text-sm text-gray-400">
                  {searchResults.length} songs
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <p className="text-red-400 text-sm">Search error: {error}</p>
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Searching for the perfect match...
                  </p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-4 px-2 py-2 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800">
                  <div className="w-8">#</div>
                  <div className="flex-1">Title</div>
                  <div className="hidden md:block flex-1">Album</div>
                  <div className="hidden lg:block w-16">Popular</div>
                  <div className="w-16"></div>
                  <div className="w-12 text-right">
                    <Clock className="h-4 w-4 ml-auto" />
                  </div>
                </div>

                {searchResults.map((track, index) => (
                  <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    onPlay={handlePlayTrack}
                    onAddToPlaylist={handleAddToPlaylist}
                    playlists={playlists}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Music2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-gray-400 mb-4">
                  Try searching for artists, songs, or albums
                </p>
                <p className="text-gray-500 text-sm">
                  Popular searches: "Taylor Swift", "Ed Sheeran", "Pop hits"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
