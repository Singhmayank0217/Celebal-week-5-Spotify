class YouTubeSearchService {
  constructor() {
    this.API_KEY =
      import.meta.env.VITE_YOUTUBE_API_KEY ||
      "AIzaSyDnjYdUHgz0GJmW7L2hZykEV-aOfSMYUrY";
    this.BASE_URL = "https://www.googleapis.com/youtube/v3";
    this.cache = new Map();
    this.requestCount = 0;
    this.maxRequests = 100;
  }

  canMakeRequest() {
    const hasValidKey =
      this.API_KEY &&
      this.API_KEY !== "YOUR_API_KEY_HERE" &&
      this.API_KEY.length > 10;
    const withinQuota = this.requestCount < this.maxRequests;

    if (!hasValidKey) {
      console.warn(
        "⚠️ No valid YouTube API key found. Add VITE_YOUTUBE_API_KEY to your .env file"
      );
      return false;
    }

    if (!withinQuota) {
      console.warn("⚠️ YouTube API quota exceeded for today");
      return false;
    }

    return true;
  }

  async searchMusic(query, maxResults = 20) {
    const cacheKey = `search-${query}-${maxResults}`;
    if (this.cache.has(cacheKey)) {
      console.log("📋 Using cached YouTube results for:", query);
      return this.cache.get(cacheKey);
    }

    if (!this.canMakeRequest()) {
      console.log("❌ Cannot make YouTube API request, using fallback");
      return this.getFallbackResults(query);
    }

    try {
      console.log("🔍 Searching YouTube for:", query);

      const searchQuery = `${query} music`;

      const url =
        `${this.BASE_URL}/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(searchQuery)}&` +
        `type=video&` +
        `videoCategoryId=10&` +
        `videoEmbeddable=true&` +
        `maxResults=${maxResults}&` +
        `order=relevance&` +
        `key=${this.API_KEY}`;

      const response = await fetch(url);
      this.requestCount++;

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("YouTube API Error:", response.status, errorData);

        if (response.status === 403) {
          console.error("❌ YouTube API quota exceeded or access denied");
        }

        return this.getFallbackResults(query);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        console.log("❌ No YouTube results found for:", query);
        return this.getFallbackResults(query);
      }

      const tracks = data.items.map((video, index) =>
        this.convertYouTubeToTrack(video, index)
      );

      this.cache.set(cacheKey, tracks);

      if (this.cache.size > 100) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      console.log(`✅ Found ${tracks.length} YouTube tracks for: ${query}`);
      return tracks;
    } catch (error) {
      console.error("❌ YouTube search error:", error);
      return this.getFallbackResults(query);
    }
  }

  convertYouTubeToTrack(video, index) {
    const snippet = video.snippet;
    const videoId = video.id.videoId;

    const { title, artist } = this.parseVideoTitle(snippet.title);

    return {
      id: videoId,
      title: title,
      artist: artist,
      album: "YouTube",
      duration: "0:00",
      cover:
        snippet.thumbnails.medium?.url ||
        snippet.thumbnails.high?.url ||
        snippet.thumbnails.default?.url,
      youtubeId: videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      genre: "Music",
      source: "youtube",
      publishedAt: snippet.publishedAt,
      channelTitle: snippet.channelTitle,
    };
  }

  parseVideoTitle(title) {
    const patterns = [
      /^(.+?)\s*[-–—]\s*(.+?)(?:\s*$$.*$$)?(?:\s*\[.*\])?$/,
      /^(.+?)\s*:\s*(.+?)(?:\s*$$.*$$)?(?:\s*\[.*\])?$/,
      /^(.+?)\s*"(.+?)".*$/,
      /^(.+?)\s*'(.+?)'.*$/,
    ];

    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return {
          artist: match[1].trim(),
          title: match[2].trim(),
        };
      }
    }

    return {
      artist: "Unknown Artist",
      title: title
        .replace(/\s*$$.*?$$/g, "")
        .replace(/\s*\[.*?\]/g, "")
        .trim(),
    };
  }

  async getPopularMusic() {
    const popularQueries = [
      "top hits 2024",
      "popular songs 2024",
      "trending music",
      "billboard hot 100",
      "viral songs",
    ];

    const randomQuery =
      popularQueries[Math.floor(Math.random() * popularQueries.length)];
    return this.searchMusic(randomQuery, 12);
  }

  async getMusicByGenre(genre) {
    const genreQueries = {
      pop: "pop music hits 2024",
      rock: "rock music classics",
      "hip hop": "hip hop rap music 2024",
      electronic: "electronic dance music",
      jazz: "jazz music classics",
      classical: "classical music",
      country: "country music hits",
      "r&b": "r&b soul music",
      indie: "indie music 2024",
      alternative: "alternative rock music",
    };

    const searchQuery = genreQueries[genre.toLowerCase()] || `${genre} music`;
    return this.searchMusic(searchQuery, 15);
  }

  getFallbackResults(query) {
    console.log("🔄 Using fallback results for:", query);

    const fallbackTracks = [
      {
        id: "fallback-1",
        title: "Search requires YouTube API",
        artist: "Setup Required",
        album: "Configuration",
        duration: "0:00",
        cover:
          "https://via.placeholder.com/300x300/1f2937/ffffff?text=API+Required",
        youtubeId: null,
        youtubeUrl: null,
        genre: "Setup",
        source: "fallback",
      },
    ];

    return fallbackTracks;
  }

  async getVideoDetails(videoId) {
    if (!this.canMakeRequest()) {
      return null;
    }

    try {
      const url =
        `${this.BASE_URL}/videos?` +
        `part=contentDetails,statistics&` +
        `id=${videoId}&` +
        `key=${this.API_KEY}`;

      const response = await fetch(url);
      this.requestCount++;

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.items?.[0] || null;
    } catch (error) {
      console.error("Error getting video details:", error);
      return null;
    }
  }

  formatDuration(duration) {
    if (!duration) return "0:00";

    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";

    const hours = Number.parseInt(match[1]) || 0;
    const minutes = Number.parseInt(match[2]) || 0;
    const seconds = Number.parseInt(match[3]) || 0;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  clearCache() {
    this.cache.clear();
  }

  getStatus() {
    return {
      hasValidKey: this.API_KEY && this.API_KEY !== "YOUR_API_KEY_HERE",
      requestCount: this.requestCount,
      remainingQuota: this.maxRequests - this.requestCount,
      cacheSize: this.cache.size,
    };
  }
}

export const youtubeSearchService = new YouTubeSearchService();
