"use client";

import { useMusicPlayer } from "../../redux/hooks/useRedux";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Shuffle,
  Repeat,
  ExternalLink,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";
import Slider from "../ui/Slider";

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlay,
    changeVolume,
    seekTo,
  } = useMusicPlayer();

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value) => {
    const newTime = value[0];
    seekTo(newTime);
    if (window.youtubePlayerSeek) {
      window.youtubePlayerSeek(newTime);
    }
  };

  const openInYouTube = () => {
    if (currentTrack.youtubeUrl) {
      window.open(currentTrack.youtubeUrl, "_blank");
    }
  };

  const hasPlayback = currentTrack.youtubeId && currentTrack.youtubeId !== null;
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {hasPlayback && (
        <YouTubePlayer
          key={`player-${currentTrack.youtubeId}`}
          videoId={currentTrack.youtubeId}
          onReady={() => console.log("🎬 Player ready")}
          onStateChange={(state) => console.log("🎵 State:", state)}
        />
      )}

      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
          <div className="flex items-center space-x-4 flex-1 min-w-0 max-w-sm">
            <div className="relative group">
              <img
                src={
                  currentTrack.cover ||
                  "https://via.placeholder.com/56x56/1f2937/ffffff?text=♪"
                }
                alt={currentTrack.title}
                className="w-14 h-14 rounded-md shadow-lg object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-md" />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-white text-sm truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </h4>
              <p className="text-gray-400 text-xs truncate hover:text-white hover:underline cursor-pointer">
                {currentTrack.artist}
              </p>
            </div>

            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Heart className="h-4 w-4" />
              </button>
              {currentTrack.youtubeUrl && (
                <button
                  onClick={openInYouTube}
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Open in YouTube"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 flex-1 max-w-2xl">
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors p-1">
                <Shuffle className="h-4 w-4" />
              </button>

              <button className="text-gray-400 hover:text-white transition-colors p-1">
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlay}
                disabled={!hasPlayback}
                className={`rounded-full p-2 transition-all duration-200 ${
                  hasPlayback
                    ? "bg-white text-black hover:scale-105 shadow-lg hover:shadow-xl"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
                title={
                  hasPlayback
                    ? isPlaying
                      ? "Pause"
                      : "Play"
                    : "No audio available"
                }
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>

              <button className="text-gray-400 hover:text-white transition-colors p-1">
                <SkipForward className="h-5 w-5" />
              </button>

              <button className="text-gray-400 hover:text-white transition-colors p-1">
                <Repeat className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center space-x-3 w-full max-w-lg group">
              <span className="text-xs text-gray-400 w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>

              <div className="flex-1 relative">
                <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                </div>

                <div className="absolute inset-0">
                  <Slider
                    value={[currentTime || 0]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full opacity-0 cursor-pointer"
                    disabled={!hasPlayback}
                  />
                </div>
              </div>

              <span className="text-xs text-gray-400 w-10 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-1 justify-end max-w-sm">
            <button className="text-gray-400 hover:text-white transition-colors p-1">
              <MoreHorizontal className="h-4 w-4" />
            </button>

            <div className="flex items-center space-x-2 group">
              <Volume2 className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />

              <div className="w-24 relative">
                <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-100 relative"
                    style={{ width: `${volume}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                  </div>
                </div>

                <div className="absolute inset-0">
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => changeVolume(value[0])}
                    className="w-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {process.env.NODE_ENV === "development" && hasPlayback && (
          <div className="text-center mt-2">
            <div className="text-xs text-gray-600">
              🎵 {currentTrack.youtubeId} | ⏱️ {formatTime(currentTime)}/
              {formatTime(duration)} | 📊 {progressPercentage.toFixed(1)}% | 🔊{" "}
              {volume}%
            </div>
          </div>
        )}
      </div>
    </>
  );
}
