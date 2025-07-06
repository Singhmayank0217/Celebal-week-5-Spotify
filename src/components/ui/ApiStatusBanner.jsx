"use client";

import { useState, useEffect } from "react";
import {
  X,
  Music2,
  Youtube,
  Zap,
  ExternalLink,
  AlertCircle,
  Database,
} from "lucide-react";

export default function ApiStatusBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [apiStatus, setApiStatus] = useState({
    spotify: false,
    youtube: false,
    quotaExceeded: false,
  });

  useEffect(() => {
    const spotifyConfigured = !!(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID &&
      import.meta.env.VITE_SPOTIFY_CLIENT_SECRET &&
      import.meta.env.VITE_SPOTIFY_CLIENT_ID !== "your_spotify_client_id" &&
      import.meta.env.VITE_SPOTIFY_CLIENT_SECRET !==
        "your_spotify_client_secret"
    );

    const youtubeConfigured = !!(
      import.meta.env.VITE_YOUTUBE_API_KEY &&
      import.meta.env.VITE_YOUTUBE_API_KEY !== "YOUR_API_KEY_HERE"
    );

    const checkQuotaStatus = () => {
      if (window.hybridMusicService) {
        const status = window.hybridMusicService.getStatus();
        setApiStatus({
          spotify: spotifyConfigured,
          youtube: youtubeConfigured,
          quotaExceeded: status.youtube.quotaExceeded,
        });
      } else {
        setApiStatus({
          spotify: spotifyConfigured,
          youtube: youtubeConfigured,
          quotaExceeded: false,
        });
      }
    };

    checkQuotaStatus();

    const interval = setInterval(checkQuotaStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  const bothConfigured = apiStatus.spotify && apiStatus.youtube;
  const quotaExceeded = apiStatus.quotaExceeded;
  const partiallyConfigured = apiStatus.spotify || apiStatus.youtube;
  const noneConfigured = !apiStatus.spotify && !apiStatus.youtube;

  const getBannerConfig = () => {
    if (quotaExceeded && bothConfigured) {
      return {
        gradient: "bg-gradient-to-r from-orange-600 to-yellow-600",
        icon: Database,
        title: "🎵 Fallback Mode Active!",
        description:
          "YouTube quota exceeded - using curated database with 100+ guaranteed playable songs",
      };
    } else if (bothConfigured) {
      return {
        gradient: "bg-gradient-to-r from-green-600 to-purple-600",
        icon: Zap,
        title: "🎯 Hybrid Mode Active!",
        description:
          "Spotify metadata + YouTube playback = Perfect music experience",
      };
    } else if (partiallyConfigured) {
      return {
        gradient: "bg-gradient-to-r from-yellow-600 to-orange-600",
        icon: AlertCircle,
        title: "⚡ Partial Setup",
        description: `${apiStatus.spotify ? "Spotify ✅" : "Spotify ❌"} • ${
          apiStatus.youtube ? "YouTube ✅" : "YouTube ❌"
        } - Add missing API for full hybrid power`,
      };
    } else {
      return {
        gradient: "bg-gradient-to-r from-red-600 to-pink-600",
        icon: AlertCircle,
        title: "🔧 Setup Required",
        description:
          "Add Spotify + YouTube APIs for the ultimate music experience",
      };
    }
  };

  const config = getBannerConfig();

  return (
    <div className={`${config.gradient} text-white p-3 relative`}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <config.icon className="h-5 w-5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-sm">{config.title}</span>
            <span className="text-xs ml-2 opacity-90">
              {config.description}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {quotaExceeded && (
            <div className="flex items-center space-x-1 text-xs bg-white/20 px-2 py-1 rounded">
              <Database className="w-3 h-3" />
              <span>Fallback DB</span>
            </div>
          )}

          {bothConfigured && !quotaExceeded && (
            <div className="flex items-center space-x-1 text-xs bg-white/20 px-2 py-1 rounded">
              <Music2 className="w-3 h-3" />
              <Youtube className="w-3 h-3" />
              <span>Hybrid</span>
            </div>
          )}

          {!bothConfigured && (
            <a
              href="https://github.com/your-repo#api-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors flex items-center"
            >
              Setup Guide
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}

          <button
            onClick={() => setShowBanner(false)}
            className="text-white hover:text-gray-200 p-1 rounded hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
