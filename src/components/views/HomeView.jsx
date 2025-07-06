"use client";

import { useState } from "react";

import { useMusicPlayer } from "../../redux/hooks/useRedux";
import { useHybridMusic } from "../../hooks/useHybridMusic";
import { Play, Loader2 } from "lucide-react";
import { useEffect, useRef, useCallback, memo } from "react";

const TrackCard = memo(({ track, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePlay = useCallback(() => onPlay(track), [onPlay, track]);

  return (
    <div
      className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
      onClick={handlePlay}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative mb-4">
        <img
          src={
            track.cover ||
            "https://via.placeholder.com/200x200/1f2937/ffffff?text=♪"
          }
          alt={track.title}
          className="w-full aspect-square object-cover rounded-lg shadow-lg"
          loading="lazy"
        />

        <div
          className={`absolute bottom-2 right-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <button className="bg-green-500 hover:bg-green-400 text-black rounded-full p-3 shadow-lg hover:scale-105 transition-all duration-200">
            <Play className="h-5 w-5 ml-0.5" />
          </button>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
        {track.title}
      </h3>
      <p className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors">
        {track.artist}
      </p>

      {track.popularity && (
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${track.popularity}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{track.popularity}%</span>
        </div>
      )}
    </div>
  );
});

TrackCard.displayName = "TrackCard";

export default function HomeView() {
  const { playTrack } = useMusicPlayer();
  const { getPopular, getGenreTracks, searchResults, isLoading, cleanup } =
    useHybridMusic();
  const hasLoaded = useRef(false);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      getPopular();
    }
  }, [getPopular]);

  const handlePlayTrack = useCallback(
    async (track) => {
      await playTrack(track);
    },
    [playTrack]
  );

  const handleTrendingClick = useCallback(
    (searchTerm) => {
      getGenreTracks(searchTerm);
    },
    [getGenreTracks]
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const trendingSearches = [
    {
      name: "Top hits 2024",
      color: "bg-gradient-to-br from-purple-600 to-blue-600",
    },
    {
      name: "Chill music",
      color: "bg-gradient-to-br from-green-600 to-teal-600",
    },
    {
      name: "Workout songs",
      color: "bg-gradient-to-br from-orange-600 to-red-600",
    },
    {
      name: "Study music",
      color: "bg-gradient-to-br from-blue-600 to-indigo-600",
    },
    {
      name: "Party playlist",
      color: "bg-gradient-to-br from-pink-600 to-purple-600",
    },
    {
      name: "Relaxing music",
      color: "bg-gradient-to-br from-gray-600 to-gray-800",
    },
  ];

  return (
    <div className="flex-1 bg-gradient-to-b from-gray-900 via-black to-black text-white overflow-y-auto">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-8">{getGreeting()}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {trendingSearches.map((item, index) => (
            <div
              key={item.name}
              className={`${item.color} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform duration-200 group relative overflow-hidden`}
              onClick={() => handleTrendingClick(item.name)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-black/20 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-white/80 text-sm">Curated playlist</p>
                </div>
              </div>

              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          ))}
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular right now</h2>
            {searchResults.length > 0 && (
              <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Show all
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
                <p className="text-gray-400">Loading your music...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {searchResults.slice(0, 12).map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onPlay={handlePlayTrack}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Made for you</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[
              {
                name: "Discover Weekly",
                desc: "Your weekly mixtape",
                color: "from-purple-600 to-blue-600",
              },
              {
                name: "Release Radar",
                desc: "New music from artists you follow",
                color: "from-green-600 to-blue-600",
              },
              {
                name: "Daily Mix 1",
                desc: "Made for you",
                color: "from-orange-600 to-red-600",
              },
              {
                name: "Daily Mix 2",
                desc: "Made for you",
                color: "from-pink-600 to-purple-600",
              },
              {
                name: "Liked Songs",
                desc: "All your favorites",
                color: "from-blue-600 to-purple-600",
              },
              {
                name: "Recently Played",
                desc: "Jump back in",
                color: "from-gray-600 to-gray-800",
              },
            ].map((playlist, index) => (
              <div
                key={playlist.name}
                className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-all duration-300 cursor-pointer group"
              >
                <div className="relative mb-4">
                  <div
                    className={`w-full aspect-square rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center`}
                  >
                    <Play className="h-8 w-8 text-white" />
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <button className="bg-green-500 hover:bg-green-400 text-black rounded-full p-2 shadow-lg hover:scale-105 transition-all duration-200">
                      <Play className="h-4 w-4 ml-0.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold text-white text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-gray-400 text-xs truncate group-hover:text-gray-300 transition-colors">
                  {playlist.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
