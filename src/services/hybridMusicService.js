import { findYouTubeId } from "../data/mockMusic";

class HybridMusicService {
  constructor() {
    this.spotifyToken = null;
    this.tokenExpiry = null;
    this.cache = new Map();
    this.requestCount = { spotify: 0, youtube: 0 };
    this.maxRequests = { spotify: 1000, youtube: 100 };
    this.youtubeQuotaExceeded = false;
    this.fallbackDatabase = this.initializeFallbackDatabase();
    this.usedYouTubeIds = new Set();
  }

  initializeFallbackDatabase() {
    return {
      "kinna sona arijit kamath": "kTJczUoc26U",
      "kinna wanna lathan warlick": "E07s5ZYygMg",
      "kina chir the prophec": "4NRXx6U8ABQ",
      "kinna sona marjaavaan": "gNi_6U5Pm_o",
      "tera kinna sonna": "TUVcZfQe-Kw",

      "blinding lights the weeknd": "4NRXx6U8ABQ",
      "shape of you ed sheeran": "JGwWNGJdvx8",
      "perfect ed sheeran": "2Vv-BfVoq4g",
      "watermelon sugar harry styles": "E07s5ZYygMg",
      "as it was harry styles": "H5v3kku4y6Q",
      "levitating dua lipa": "TUVcZfQe-Kw",
      "dont start now dua lipa": "oygrmJFKYZY",
      "good 4 u olivia rodrigo": "gNi_6U5Pm_o",
      "drivers license olivia rodrigo": "ZmDBbnmKpqQ",
      "anti hero taylor swift": "b1kbLWvqugk",
      "shake it off taylor swift": "nfWlot6h_JM",
      "blank space taylor swift": "SeIJmciN8mo",
      "flowers miley cyrus": "G7KNmW9a75Y",
      "unholy sam smith": "Uq9gPaIzbe8",
      "heat waves glass animals": "mRD0-GxqHVo",
      "stay the kid laroi": "kTJczUoc26U",
      "sunflower post malone": "ApXoWvfEYVU",
      "circles post malone": "wXhTHyIgQ_U",
      "gods plan drake": "xpVfcZ0ZcFM",
      "thank u next ariana grande": "gl1aHhXnN1k",
      "7 rings ariana grande": "QYh6mYIJG2Y",
      "sorry justin bieber": "fRh_vgS2dFE",
      "love yourself justin bieber": "oyEuk8j8imI",
      "roar katy perry": "CevxZvSJLk8",
      "uptown funk bruno mars": "OPf0YbXqDm0",
      "rolling in the deep adele": "rYEDA3JcQqw",
      "hello adele": "YQHsXMglC9A",
      "bohemian rhapsody queen": "fJ9rUzIMcZQ",
      "counting stars onerepublic": "hT_nvWreIhg",
      "sugar maroon 5": "09R8_2nJtjg",

      backup_pool: [
        "Il0S8BoucSA",
        "pbMwTqkKSps",
        "DyDfgMOUjCI",
        "V1Pl8CzNzCw",
        "k2qgadSvNyU",
        "9HDEHj2yzew",
        "DkeiKbqa02g",
        "UceaB4D0jpo",
        "SC4xMk98Pdc",
        "DRS_PpOrUZ4",
        "uxpDa-c-4Mc",
        "chMkL3RruzI",
        "kN0iD0pI3o0",
        "ffxKSjUwKdU",
        "Pkh8UtuejGw",
        "VbfpgYYT_88",
        "lY2yjAdbvdQ",
        "dT2owtxkU8k",
        "DK_0jXPuIr0",
        "kffacxfA7G4",
        "QGJuMBdaqIw",
        "0KSOMA3QBU0",
        "F57P9C4SAW4",
        "fzQ6gRAEoy0",
        "LjhCEhWiKXk",
        "SR6iYWJxHqs",
        "hLQl3WQQoQ0",
        "FlsBObg-1BQ",
        "1k8craCGpgs",
        "1w7OgIMMRc4",
        "BciS5krYL80",
        "QkF3oxziUI4",
      ],
    };
  }

  findYouTubeIdWithFallback(trackName, artistName, trackId) {
    console.log(
      `🔍 Looking for unique YouTube ID: "${trackName}" by "${artistName}" (ID: ${trackId})`
    );

    const exactSearchKey = `${trackName} ${artistName}`
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    console.log(`🔑 Search key: "${exactSearchKey}"`);

    if (this.fallbackDatabase[exactSearchKey]) {
      const youtubeId = this.fallbackDatabase[exactSearchKey];
      if (!this.usedYouTubeIds.has(youtubeId)) {
        this.usedYouTubeIds.add(youtubeId);
        console.log(`🎯 Found exact match: ${youtubeId}`);
        return youtubeId;
      }
    }

    const artistKey = artistName
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();
    for (const [key, videoId] of Object.entries(this.fallbackDatabase)) {
      if (
        key !== "backup_pool" &&
        key.includes(artistKey) &&
        !this.usedYouTubeIds.has(videoId)
      ) {
        this.usedYouTubeIds.add(videoId);
        console.log(`🎯 Found artist match: ${videoId}`);
        return videoId;
      }
    }

    const trackKey = trackName
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();
    for (const [key, videoId] of Object.entries(this.fallbackDatabase)) {
      if (
        key !== "backup_pool" &&
        key.includes(trackKey) &&
        trackKey.length > 3 &&
        !this.usedYouTubeIds.has(videoId)
      ) {
        this.usedYouTubeIds.add(videoId);
        console.log(`🎯 Found track match: ${videoId}`);
        return videoId;
      }
    }

    const backupPool = this.fallbackDatabase.backup_pool;
    const availableIds = backupPool.filter(
      (id) => !this.usedYouTubeIds.has(id)
    );

    if (availableIds.length > 0) {
      const index =
        Math.abs(trackId.split("").reduce((a, b) => a + b.charCodeAt(0), 0)) %
        availableIds.length;
      const selectedId = availableIds[index];
      this.usedYouTubeIds.add(selectedId);
      console.log(`🎯 Assigned unique backup ID: ${selectedId}`);
      return selectedId;
    }

    const originalResult = findYouTubeId(trackName, artistName);
    if (originalResult && !this.usedYouTubeIds.has(originalResult)) {
      this.usedYouTubeIds.add(originalResult);
      console.log(`🎯 Found in original database: ${originalResult}`);
      return originalResult;
    }

    console.log(
      `❌ No unique YouTube ID available for: "${trackName}" by "${artistName}"`
    );
    return null;
  }

  async getSpotifyToken() {
    if (
      this.spotifyToken &&
      this.tokenExpiry &&
      Date.now() < this.tokenExpiry
    ) {
      return this.spotifyToken;
    }

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    if (
      !clientId ||
      !clientSecret ||
      clientId === "your_spotify_client_id" ||
      clientSecret === "your_spotify_client_secret"
    ) {
      console.warn("⚠️ Spotify credentials not configured");
      return null;
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error(`Spotify token error: ${response.status}`);
      }

      const data = await response.json();
      this.spotifyToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;

      console.log("✅ Spotify token obtained");
      return this.spotifyToken;
    } catch (error) {
      console.error("❌ Spotify token error:", error);
      return null;
    }
  }

  async searchSpotify(query, limit = 20) {
    const token = await this.getSpotifyToken();
    if (!token) return [];

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=${limit}&market=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      this.requestCount.spotify++;

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `📊 Found ${data.tracks.items.length} Spotify tracks for: ${query}`
      );
      return data.tracks.items;
    } catch (error) {
      console.error("❌ Spotify search error:", error);
      return [];
    }
  }

  createHybridTrack(spotifyTrack, youtubeVideo) {
    const youtubeId =
      youtubeVideo?.id?.videoId ||
      this.findYouTubeIdWithFallback(
        spotifyTrack.name,
        spotifyTrack.artists[0]?.name || "",
        spotifyTrack.id
      );

    const track = {
      id: spotifyTrack.id,
      title: spotifyTrack.name,
      artist: spotifyTrack.artists.map((artist) => artist.name).join(", "),
      album: spotifyTrack.album.name,
      duration: this.formatDuration(spotifyTrack.duration_ms),
      cover:
        spotifyTrack.album.images[0]?.url ||
        spotifyTrack.album.images[1]?.url ||
        "",
      youtubeId: youtubeId,
      youtubeUrl: youtubeId
        ? `https://www.youtube.com/watch?v=${youtubeId}`
        : null,
      spotifyId: spotifyTrack.id,
      spotifyUrl: spotifyTrack.external_urls?.spotify,
      popularity: spotifyTrack.popularity,
      explicit: spotifyTrack.explicit,
      previewUrl: spotifyTrack.preview_url,
      releaseDate: spotifyTrack.album.release_date,
      genre: "Music",
      source: "hybrid",
      hasPlayback: !!youtubeId,
    };

    console.log(
      `🎵 Hybrid track: "${track.title}" by "${track.artist}" - YouTube ID: ${
        track.youtubeId || "❌ None"
      }`
    );
    return track;
  }

  async searchTracks(query, limit = 20) {
    const cacheKey = `hybrid-${query}-${limit}`;

    if (this.cache.has(cacheKey)) {
      console.log("📋 Using cached hybrid results for:", query);
      return this.cache.get(cacheKey);
    }

    console.log("🔍 Hybrid search for:", query);

    this.usedYouTubeIds.clear();

    try {
      const spotifyTracks = await this.searchSpotify(
        query,
        Math.min(limit, 15)
      );

      if (spotifyTracks.length === 0) {
        console.log("📊 No Spotify results, using fallback tracks");
        return this.getFallbackTracks(query, limit);
      }

      const hybridTracks = spotifyTracks.map((spotifyTrack) => {
        return this.createHybridTrack(spotifyTrack, null);
      });

      this.cache.set(cacheKey, hybridTracks);

      const playableCount = hybridTracks.filter(
        (track) => track.hasPlayback
      ).length;
      console.log(
        `✅ Hybrid search complete: ${hybridTracks.length} tracks, ${playableCount} playable`
      );

      return hybridTracks;
    } catch (error) {
      console.error("❌ Hybrid search error:", error);
      return this.getFallbackTracks(query, limit);
    }
  }

  getFallbackTracks(query, limit) {
    console.log("🔄 Using fallback tracks for:", query);

    const fallbackTracks = [
      {
        title: "Blinding Lights",
        artist: "The Weeknd",
        youtubeId: "4NRXx6U8ABQ",
        popularity: 95,
      },
      {
        title: "Shape of You",
        artist: "Ed Sheeran",
        youtubeId: "JGwWNGJdvx8",
        popularity: 92,
      },
      {
        title: "Levitating",
        artist: "Dua Lipa",
        youtubeId: "TUVcZfQe-Kw",
        popularity: 90,
      },
      {
        title: "Good 4 U",
        artist: "Olivia Rodrigo",
        youtubeId: "gNi_6U5Pm_o",
        popularity: 88,
      },
      {
        title: "As It Was",
        artist: "Harry Styles",
        youtubeId: "H5v3kku4y6Q",
        popularity: 87,
      },
      {
        title: "Anti-Hero",
        artist: "Taylor Swift",
        youtubeId: "b1kbLWvqugk",
        popularity: 85,
      },
      {
        title: "Flowers",
        artist: "Miley Cyrus",
        youtubeId: "G7KNmW9a75Y",
        popularity: 84,
      },
      {
        title: "Unholy",
        artist: "Sam Smith",
        youtubeId: "Uq9gPaIzbe8",
        popularity: 82,
      },
      {
        title: "Heat Waves",
        artist: "Glass Animals",
        youtubeId: "mRD0-GxqHVo",
        popularity: 80,
      },
      {
        title: "Stay",
        artist: "The Kid LAROI",
        youtubeId: "kTJczUoc26U",
        popularity: 78,
      },
    ];

    return fallbackTracks.slice(0, limit).map((track, index) => ({
      id: `fallback-${index}`,
      title: track.title,
      artist: track.artist,
      album: `Results for "${query}"`,
      duration: "3:30",
      cover: `https://i.ytimg.com/vi/${track.youtubeId}/mqdefault.jpg`,
      youtubeId: track.youtubeId,
      youtubeUrl: `https://www.youtube.com/watch?v=${track.youtubeId}`,
      popularity: track.popularity,
      genre: "Music",
      source: "fallback",
      hasPlayback: true,
    }));
  }

  async getPopularTracks() {
    console.log("🔥 Getting popular hybrid tracks");
    return this.searchTracks("top hits 2024 popular songs", 15);
  }

  async getTracksByGenre(genre) {
    const genreQueries = {
      "pop music": "pop hits 2024",
      "hip hop": "hip hop rap 2024",
      rock: "rock music hits",
      electronic: "electronic dance music",
      jazz: "jazz music",
      classical: "classical music",
      country: "country music hits",
      "r&b": "r&b soul music",
      indie: "indie music 2024",
      "chill music": "chill relaxing music",
      "workout songs": "workout music pump up",
      "study music": "study focus music",
      "party playlist": "party dance music",
      "relaxing music": "relaxing calm music",
    };

    const searchQuery = genreQueries[genre.toLowerCase()] || `${genre} music`;
    return this.searchTracks(searchQuery, 15);
  }

  formatDuration(ms) {
    if (!ms) return "3:30";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  getStatus() {
    const hasSpotify = !!(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID &&
      import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
    );
    const hasYoutube = !!(
      import.meta.env.VITE_YOUTUBE_API_KEY &&
      import.meta.env.VITE_YOUTUBE_API_KEY !== "YOUR_API_KEY_HERE"
    );

    return {
      spotify: {
        configured: hasSpotify,
        requests: this.requestCount.spotify,
        hasToken: !!this.spotifyToken,
      },
      youtube: {
        configured: hasYoutube,
        requests: this.requestCount.youtube,
        remaining: this.maxRequests.youtube - this.requestCount.youtube,
        quotaExceeded: this.youtubeQuotaExceeded,
      },
      cache: {
        size: this.cache.size,
      },
      fallbackDatabase: {
        size: Object.keys(this.fallbackDatabase).length - 1,
      },
      usedIds: {
        count: this.usedYouTubeIds.size,
      },
    };
  }

  clearCache() {
    this.cache.clear();
    this.usedYouTubeIds.clear();
  }

  resetQuotaStatus() {
    this.youtubeQuotaExceeded = false;
    this.requestCount.youtube = 0;
    console.log("🔄 YouTube quota status reset");
  }
}

export const hybridMusicService = new HybridMusicService();

if (typeof window !== "undefined") {
  window.hybridMusicService = hybridMusicService;
}
