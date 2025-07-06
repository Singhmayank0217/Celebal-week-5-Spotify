const SPOTIFY_CLIENT_ID =
  import.meta.env.VITE_SPOTIFY_CLIENT_ID || "your_spotify_client_id";
const SPOTIFY_CLIENT_SECRET =
  import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "your_spotify_client_secret";

class SpotifyAPI {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(
            `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
          )}`,
        },
        body: "grant_type=client_credentials",
      });

      if (!response.ok) {
        throw new Error("Failed to get Spotify access token");
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000;

      return this.accessToken;
    } catch (error) {
      console.error("Spotify token error:", error);
      return null;
    }
  }

  async searchTracks(query, limit = 20) {
    try {
      const token = await this.getAccessToken();
      if (!token) {
        throw new Error("No Spotify access token");
      }

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error("Spotify search error:", error);
      return [];
    }
  }

  async getFeaturedPlaylists(limit = 20) {
    try {
      const token = await this.getAccessToken();
      if (!token) return [];

      const response = await fetch(
        `https://api.spotify.com/v1/browse/featured-playlists?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.playlists.items;
    } catch (error) {
      console.error("Spotify featured playlists error:", error);
      return [];
    }
  }

  async getNewReleases(limit = 20) {
    try {
      const token = await this.getAccessToken();
      if (!token) return [];

      const response = await fetch(
        `https://api.spotify.com/v1/browse/new-releases?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.albums.items;
    } catch (error) {
      console.error("Spotify new releases error:", error);
      return [];
    }
  }
}

export const spotifyApi = new SpotifyAPI();
