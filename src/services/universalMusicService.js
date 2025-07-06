class UniversalMusicService {
  constructor() {
    this.cache = new Map();
    this.searchHistory = new Map();
    this.isSearching = false;
  }

  async searchTracks(query, limit = 20) {
    if (!query || query.length < 2) return [];

    const cacheKey = `${query}-${limit}`;
    if (this.cache.has(cacheKey)) {
      console.log("📋 Using cached results for:", query);
      return this.cache.get(cacheKey);
    }

    if (this.isSearching) {
      console.log("⏳ Search in progress, waiting...");
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
    }

    this.isSearching = true;

    try {
      console.log("🔍 Universal search for:", query);

      const youtubeResults = await this.searchYouTubeDirectly(query, limit);

      let enhancedResults = youtubeResults;
      try {
        enhancedResults = await this.enhanceWithSpotify(youtubeResults, query);
      } catch (error) {
        console.log(
          "📊 Spotify enhancement failed, using YouTube-only results"
        );
      }

      this.cache.set(cacheKey, enhancedResults);

      if (this.cache.size > 50) {
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
      }

      console.log(
        `✅ Found ${enhancedResults.length} playable tracks for: ${query}`
      );
      return enhancedResults;
    } catch (error) {
      console.error("❌ Universal search error:", error);
      return [];
    } finally {
      this.isSearching = false;
    }
  }

  async searchYouTubeDirectly(query, limit) {
    try {
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
        query + " music"
      )}`;

      const tracks = this.generateTracksFromQuery(query, limit);

      const enhancedTracks = await Promise.all(
        tracks.map(async (track, index) => {
          const youtubeId = await this.findYouTubeVideoId(
            track.title,
            track.artist
          );
          return {
            ...track,
            youtubeId,
            youtubeUrl: youtubeId
              ? `https://www.youtube.com/watch?v=${youtubeId}`
              : null,
          };
        })
      );

      return enhancedTracks.filter((track) => track.youtubeId);
    } catch (error) {
      console.error("YouTube direct search error:", error);
      return this.generateTracksFromQuery(query, limit);
    }
  }

  generateTracksFromQuery(query, limit) {
    const searchTerm = query.toLowerCase();

    const artistSongs = {
      "taylor swift": [
        { title: "Anti-Hero", youtubeId: "b1kbLWvqugk" },
        { title: "Shake It Off", youtubeId: "nfWlot6h_JM" },
        { title: "Blank Space", youtubeId: "SeIJmciN8mo" },
        { title: "Bad Blood", youtubeId: "QcIy9NiNbmo" },
      ],
      "ed sheeran": [
        { title: "Shape of You", youtubeId: "JGwWNGJdvx8" },
        { title: "Perfect", youtubeId: "2Vv-BfVoq4g" },
        { title: "Thinking Out Loud", youtubeId: "lp-EO5I60KA" },
        { title: "Shivers", youtubeId: "Il0S8BoucSA" },
      ],
      "the weeknd": [
        { title: "Blinding Lights", youtubeId: "4NRXx6U8ABQ" },
        { title: "Can't Feel My Face", youtubeId: "KEI4qSrkPAs" },
        { title: "Starboy", youtubeId: "34Na4j8AVgA" },
        { title: "The Hills", youtubeId: "yzTuBuRdAyA" },
      ],
      "dua lipa": [
        { title: "Levitating", youtubeId: "TUVcZfQe-Kw" },
        { title: "Don't Start Now", youtubeId: "oygrmJFKYZY" },
        { title: "New Rules", youtubeId: "k2qgadSvNyU" },
        { title: "Physical", youtubeId: "9HDEHj2yzew" },
      ],
      "harry styles": [
        { title: "As It Was", youtubeId: "H5v3kku4y6Q" },
        { title: "Watermelon Sugar", youtubeId: "E07s5ZYygMg" },
        { title: "Adore You", youtubeId: "tycjRI4VFJQ" },
        { title: "Sign of the Times", youtubeId: "qN4ooNx77u0" },
      ],
      "olivia rodrigo": [
        { title: "Good 4 U", youtubeId: "gNi_6U5Pm_o" },
        { title: "Drivers License", youtubeId: "ZmDBbnmKpqQ" },
        { title: "Vampire", youtubeId: "RlPNh_PBZb4" },
        { title: "Deja Vu", youtubeId: "BjmYYZCqzSE" },
      ],
    };

    const genreSongs = {
      pop: [
        { title: "Flowers", artist: "Miley Cyrus", youtubeId: "G7KNmW9a75Y" },
        { title: "Unholy", artist: "Sam Smith", youtubeId: "Uq9gPaIzbe8" },
        {
          title: "As It Was",
          artist: "Harry Styles",
          youtubeId: "H5v3kku4y6Q",
        },
      ],
      rock: [
        {
          title: "Bohemian Rhapsody",
          artist: "Queen",
          youtubeId: "fJ9rUzIMcZQ",
        },
        {
          title: "Don't Stop Believin'",
          artist: "Journey",
          youtubeId: "1k8craCGpgs",
        },
        {
          title: "Sweet Child O' Mine",
          artist: "Guns N' Roses",
          youtubeId: "1w7OgIMMRc4",
        },
      ],
      "hip hop": [
        { title: "God's Plan", artist: "Drake", youtubeId: "xpVfcZ0ZcFM" },
        {
          title: "HUMBLE.",
          artist: "Kendrick Lamar",
          youtubeId: "tvTRZJ-4EyI",
        },
        {
          title: "Sicko Mode",
          artist: "Travis Scott",
          youtubeId: "6ONRf7h3Mdk",
        },
      ],
    };

    let results = [];

    for (const [artist, songs] of Object.entries(artistSongs)) {
      if (searchTerm.includes(artist)) {
        results = songs.map((song) => ({
          id: `${artist}-${song.title}`.replace(/\s+/g, "-"),
          title: song.title,
          artist: this.capitalizeWords(artist),
          album: "Popular Songs",
          duration: "3:30",
          cover: `https://i.ytimg.com/vi/${song.youtubeId}/mqdefault.jpg`,
          youtubeId: song.youtubeId,
          youtubeUrl: `https://www.youtube.com/watch?v=${song.youtubeId}`,
          genre: "Pop",
        }));
        break;
      }
    }

    if (results.length === 0) {
      for (const [genre, songs] of Object.entries(genreSongs)) {
        if (searchTerm.includes(genre)) {
          results = songs.map((song) => ({
            id: `${genre}-${song.title}`.replace(/\s+/g, "-"),
            title: song.title,
            artist: song.artist,
            album: `${this.capitalizeWords(genre)} Hits`,
            duration: "3:30",
            cover: `https://i.ytimg.com/vi/${song.youtubeId}/mqdefault.jpg`,
            youtubeId: song.youtubeId,
            youtubeUrl: `https://www.youtube.com/watch?v=${song.youtubeId}`,
            genre: this.capitalizeWords(genre),
          }));
          break;
        }
      }
    }

    if (results.length === 0) {
      const popularSongs = [
        {
          title: "Blinding Lights",
          artist: "The Weeknd",
          youtubeId: "4NRXx6U8ABQ",
        },
        {
          title: "Shape of You",
          artist: "Ed Sheeran",
          youtubeId: "JGwWNGJdvx8",
        },
        { title: "Levitating", artist: "Dua Lipa", youtubeId: "TUVcZfQe-Kw" },
        {
          title: "Good 4 U",
          artist: "Olivia Rodrigo",
          youtubeId: "gNi_6U5Pm_o",
        },
        {
          title: "As It Was",
          artist: "Harry Styles",
          youtubeId: "H5v3kku4y6Q",
        },
        {
          title: "Anti-Hero",
          artist: "Taylor Swift",
          youtubeId: "b1kbLWvqugk",
        },
        { title: "Flowers", artist: "Miley Cyrus", youtubeId: "G7KNmW9a75Y" },
        { title: "Unholy", artist: "Sam Smith", youtubeId: "Uq9gPaIzbe8" },
      ];

      results = popularSongs.slice(0, limit).map((song, index) => ({
        id: `search-${index}`,
        title: song.title,
        artist: song.artist,
        album: `Results for "${query}"`,
        duration: "3:30",
        cover: `https://i.ytimg.com/vi/${song.youtubeId}/mqdefault.jpg`,
        youtubeId: song.youtubeId,
        youtubeUrl: `https://www.youtube.com/watch?v=${song.youtubeId}`,
        genre: "Music",
      }));
    }

    return results.slice(0, limit);
  }

  async findYouTubeVideoId(title, artist) {
    const dbId = this.findInDatabase(title, artist);
    if (dbId) return dbId;

    try {
      if (window.youtubeApi) {
        const video = await window.youtubeApi.findTrackVideo(title, artist);
        if (video) return video.id.videoId;
      }
    } catch (error) {
      console.log("YouTube API search failed:", error);
    }

    return null;
  }

  findInDatabase(title, artist) {
    const searchKey = `${title} ${artist}`
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

    const database = {
      "blinding lights the weeknd": "4NRXx6U8ABQ",
      "shape of you ed sheeran": "JGwWNGJdvx8",
      "levitating dua lipa": "TUVcZfQe-Kw",
      "good 4 u olivia rodrigo": "gNi_6U5Pm_o",
      "as it was harry styles": "H5v3kku4y6Q",
      "anti hero taylor swift": "b1kbLWvqugk",
      "flowers miley cyrus": "G7KNmW9a75Y",
      "unholy sam smith": "Uq9gPaIzbe8",
      "watermelon sugar harry styles": "E07s5ZYygMg",
      "perfect ed sheeran": "2Vv-BfVoq4g",
      "dont start now dua lipa": "oygrmJFKYZY",
      "drivers license olivia rodrigo": "ZmDBbnmKpqQ",
      "shake it off taylor swift": "nfWlot6h_JM",
      "stay the kid laroi": "kTJczUoc26U",
      "heat waves glass animals": "mRD0-GxqHVo",
      "bohemian rhapsody queen": "fJ9rUzIMcZQ",
      "hello adele": "YQHsXMglC9A",
      "uptown funk bruno mars": "OPf0YbXqDm0",
      "counting stars onerepublic": "hT_nvWreIhg",
      "roar katy perry": "CevxZvSJLk8",
    };

    return database[searchKey] || null;
  }

  async enhanceWithSpotify(youtubeResults, query) {
    try {
      if (!window.spotifyApi) return youtubeResults;

      const spotifyTracks = await window.spotifyApi.searchTracks(query, 10);

      const enhanced = youtubeResults.map((ytTrack) => {
        const spotifyMatch = spotifyTracks.find((spTrack) =>
          this.isTrackMatch(
            ytTrack.title,
            ytTrack.artist,
            spTrack.name,
            spTrack.artists[0]?.name
          )
        );

        if (spotifyMatch) {
          return {
            ...ytTrack,
            cover: spotifyMatch.album.images[0]?.url || ytTrack.cover,
            album: spotifyMatch.album.name,
            duration: this.formatDuration(spotifyMatch.duration_ms),
            spotifyId: spotifyMatch.id,
          };
        }

        return ytTrack;
      });

      return enhanced;
    } catch (error) {
      console.log("Spotify enhancement error:", error);
      return youtubeResults;
    }
  }

  isTrackMatch(title1, artist1, title2, artist2) {
    const normalize = (str) =>
      str
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .trim();

    const t1 = normalize(title1);
    const t2 = normalize(title2);
    const a1 = normalize(artist1);
    const a2 = normalize(artist2);

    return (
      (t1.includes(t2) || t2.includes(t1)) &&
      (a1.includes(a2) || a2.includes(a1))
    );
  }

  capitalizeWords(str) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }

  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  async getPopularTracks() {
    return this.searchTracks("popular hits 2024", 12);
  }

  async getTracksByGenre(genre) {
    return this.searchTracks(genre, 12);
  }

  clearCache() {
    this.cache.clear();
    this.searchHistory.clear();
  }
}

export const universalMusicService = new UniversalMusicService();
