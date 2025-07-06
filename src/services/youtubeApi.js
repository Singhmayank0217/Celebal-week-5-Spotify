class YouTubeAPI {
  constructor() {
    this.API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyDnjYdUHgz0GJmW7L2hZykEV-aOfSMYUrY";
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
      console.warn("⚠️ No valid YouTube API key found");
      return false;
    }

    if (!withinQuota) {
      console.warn("⚠️ YouTube API quota exceeded");
      return false;
    }

    return true;
  }

  async findTrackVideo(title, artist) {
    console.log(`🔍 SEARCHING: "${title}" by "${artist}"`);

    const cacheKey = `${title.toLowerCase().trim()}-${artist
      .toLowerCase()
      .trim()}`;

    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      console.log(
        `📋 CACHED: Using ${cached.videoId} for "${title}" by "${artist}"`
      );
      return cached;
    }

    if (!this.canMakeRequest()) {
      console.log("❌ Cannot make YouTube API request, using unique fallback");
      return this.getUniqueFallbackVideo(title, artist);
    }

    try {
      const searchQueries = [
        `"${title}" "${artist}" official audio`,
        `"${title}" "${artist}" official`,
        `${title} ${artist} official audio`,
        `${title} ${artist} music video`,
        `${title} ${artist}`,
      ];

      console.log(`🔍 Trying ${searchQueries.length} search variations...`);

      for (let i = 0; i < searchQueries.length; i++) {
        const query = searchQueries[i];
        console.log(`🔍 Search ${i + 1}: "${query}"`);

        const url =
          `${this.BASE_URL}/search?` +
          `part=snippet&` +
          `q=${encodeURIComponent(query)}&` +
          `type=video&` +
          `videoCategoryId=10&` +
          `videoEmbeddable=true&` +
          `maxResults=5&` +
          `order=relevance&` +
          `key=${this.API_KEY}`;

        const response = await fetch(url);
        this.requestCount++;

        if (!response.ok) {
          console.log(`❌ API error ${response.status} for query: "${query}"`);
          continue;
        }

        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const bestVideo = this.findBestMatch(data.items, title, artist);

          if (bestVideo) {
            const videoResult = {
              videoId: bestVideo.id.videoId,
              title: bestVideo.snippet.title,
              channelTitle: bestVideo.snippet.channelTitle,
              thumbnail:
                bestVideo.snippet.thumbnails.medium?.url ||
                bestVideo.snippet.thumbnails.default?.url,
              publishedAt: bestVideo.snippet.publishedAt,
              searchQuery: query,
              originalTitle: title,
              originalArtist: artist,
            };

            this.cache.set(cacheKey, videoResult);

            console.log(
              `✅ FOUND UNIQUE: ${videoResult.videoId} for "${title}" by "${artist}"`
            );
            console.log(`📺 YouTube Title: "${videoResult.title}"`);
            return videoResult;
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      console.log(`❌ No YouTube results found for: "${title}" by "${artist}"`);
      return this.getUniqueFallbackVideo(title, artist);
    } catch (error) {
      console.error("❌ YouTube search error:", error);
      return this.getUniqueFallbackVideo(title, artist);
    }
  }

  findBestMatch(videos, title, artist) {
    console.log(`🎯 Analyzing ${videos.length} videos for best match...`);

    const titleWords = title
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 2);
    const artistWords = artist
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 2);

    let bestVideo = null;
    let bestScore = 0;

    for (const video of videos) {
      const videoTitle = video.snippet.title.toLowerCase();
      const channelTitle = video.snippet.channelTitle.toLowerCase();

      let score = 0;

      titleWords.forEach((word) => {
        if (videoTitle.includes(word)) {
          score += 3;
        }
      });

      artistWords.forEach((word) => {
        if (videoTitle.includes(word) || channelTitle.includes(word)) {
          score += 2;
        }
      });

      if (videoTitle.includes("official")) score += 2;
      if (videoTitle.includes("audio")) score += 1;
      if (videoTitle.includes("music video")) score += 1;

      console.log(`📊 "${video.snippet.title}" - Score: ${score}`);

      if (score > bestScore) {
        bestScore = score;
        bestVideo = video;
      }
    }

    if (bestVideo) {
      console.log(
        `🏆 BEST MATCH: "${bestVideo.snippet.title}" (Score: ${bestScore})`
      );
    }

    return bestVideo;
  }

  getUniqueFallbackVideo(title, artist) {
    console.log(`🔄 Getting UNIQUE fallback for: "${title}" by "${artist}"`);

    const hash = this.createHash(title + artist);

    const fallbackVideos = [
      { id: "4NRXx6U8ABQ", title: "Blinding Lights", artist: "The Weeknd" },
      { id: "JGwWNGJdvx8", title: "Shape of You", artist: "Ed Sheeran" },
      { id: "TUVcZfQe-Kw", title: "Levitating", artist: "Dua Lipa" },
      { id: "gNi_6U5Pm_o", title: "Good 4 U", artist: "Olivia Rodrigo" },
      { id: "H5v3kku4y6Q", title: "As It Was", artist: "Harry Styles" },
      { id: "b1kbLWvqugk", title: "Anti-Hero", artist: "Taylor Swift" },
      { id: "G7KNmW9a75Y", title: "Flowers", artist: "Miley Cyrus" },
      { id: "Uq9gPaIzbe8", title: "Unholy", artist: "Sam Smith" },
      { id: "mRD0-GxqHVo", title: "Heat Waves", artist: "Glass Animals" },
      { id: "kTJczUoc26U", title: "Stay", artist: "The Kid LAROI" },
      { id: "E07s5ZYygMg", title: "Watermelon Sugar", artist: "Harry Styles" },
      { id: "ApXoWvfEYVU", title: "Sunflower", artist: "Post Malone" },
      { id: "xpVfcZ0ZcFM", title: "God's Plan", artist: "Drake" },
      { id: "gl1aHhXnN1k", title: "Thank U Next", artist: "Ariana Grande" },
      { id: "fRh_vgS2dFE", title: "Sorry", artist: "Justin Bieber" },
      { id: "CevxZvSJLk8", title: "Roar", artist: "Katy Perry" },
      { id: "OPf0YbXqDm0", title: "Uptown Funk", artist: "Bruno Mars" },
      { id: "rYEDA3JcQqw", title: "Rolling in the Deep", artist: "Adele" },
      { id: "YQHsXMglC9A", title: "Hello", artist: "Adele" },
      { id: "fJ9rUzIMcZQ", title: "Bohemian Rhapsody", artist: "Queen" },
    ];

    const index = hash % fallbackVideos.length;
    const fallback = fallbackVideos[index];

    console.log(
      `🎯 UNIQUE FALLBACK: ${fallback.id} (${fallback.title}) for "${title}" by "${artist}"`
    );

    return {
      videoId: fallback.id,
      title: `${title} - ${artist}`,
      channelTitle: artist,
      thumbnail: `https://i.ytimg.com/vi/${fallback.id}/mqdefault.jpg`,
      publishedAt: new Date().toISOString(),
      isFallback: true,
      fallbackReason: "API quota exceeded or no results",
      originalTitle: title,
      originalArtist: artist,
    };
  }

  createHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  clearCache() {
    console.log("🗑️ Clearing YouTube search cache");
    this.cache.clear();
  }

  getStatus() {
    return {
      hasValidKey: this.API_KEY && this.API_KEY !== "YOUR_API_KEY_HERE",
      requestCount: this.requestCount,
      remainingQuota: this.maxRequests - this.requestCount,
      cacheSize: this.cache.size,
      cachedSongs: Array.from(this.cache.keys()),
    };
  }
}

export const youtubeApi = new YouTubeAPI();

if (typeof window !== "undefined") {
  window.youtubeApi = youtubeApi;
}
