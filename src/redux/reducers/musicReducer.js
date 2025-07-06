import { createReducer } from "@reduxjs/toolkit";
import {
  setCurrentTrack,
  togglePlayPause,
  setIsPlaying,
  setVolume,
  setCurrentTime,
  setDuration,
  addToQueue,
  removeFromQueue,
  clearQueue,
  setQueue,
  setSearchResults,
  setSearchQuery,
  clearSearchResults,
  setCurrentView,
  setSelectedPlaylist,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  setLoading,
  setError,
  clearError,
} from "../actions/musicActions";

const initialState = {
  currentTrack: null,
  isPlaying: false,
  volume: 75,
  currentTime: 0,
  duration: 0,

  queue: [],
  currentQueueIndex: 0,

  searchResults: [],
  searchQuery: "",

  currentView: "home",
  selectedPlaylist: null,

  playlists: [
    {
      id: "1",
      name: "My Favorites",
      description: "Your most loved tracks",
      cover: "https://via.placeholder.com/200x200/1f2937/ffffff?text=Favorites",
      tracks: [],
      createdAt: "2024-01-01",
      isPublic: false,
    },
    {
      id: "2",
      name: "Chill Vibes",
      description: "Relaxing music for any time",
      cover: "https://via.placeholder.com/200x200/1f2937/ffffff?text=Chill",
      tracks: [],
      createdAt: "2024-01-02",
      isPublic: true,
    },
  ],

  isLoading: false,
  error: null,
};

const musicReducer = createReducer(initialState, (builder) => {
  builder

    .addCase(setCurrentTrack, (state, action) => {
      console.log(
        "🎵 Redux: Setting current track:",
        action.payload.title,
        "YouTube ID:",
        action.payload.youtubeId
      );
      state.currentTrack = action.payload;
      state.currentTime = 0;
      state.duration = 0;
    })
    .addCase(togglePlayPause, (state) => {
      console.log("🎵 Redux: Toggling play/pause. Was:", state.isPlaying);
      state.isPlaying = !state.isPlaying;
      console.log("🎵 Redux: Now:", state.isPlaying);
    })
    .addCase(setIsPlaying, (state, action) => {
      console.log("🎵 Redux: Setting isPlaying to:", action.payload);
      state.isPlaying = action.payload;
    })
    .addCase(setVolume, (state, action) => {
      state.volume = action.payload;
    })
    .addCase(setCurrentTime, (state, action) => {
      const newTime = action.payload;
      if (
        newTime >= 0 &&
        !isNaN(newTime) &&
        Math.abs(newTime - state.currentTime) > 0.5
      ) {
        state.currentTime = newTime;
      }
    })
    .addCase(setDuration, (state, action) => {
      console.log("⏱️ Redux: Setting duration to:", action.payload);
      const newDuration = action.payload;
      if (newDuration > 0 && !isNaN(newDuration)) {
        state.duration = newDuration;
      }
    })

    .addCase(addToQueue, (state, action) => {
      state.queue.push(action.payload);
    })
    .addCase(removeFromQueue, (state, action) => {
      state.queue = state.queue.filter((track) => track.id !== action.payload);
    })
    .addCase(clearQueue, (state) => {
      state.queue = [];
      state.currentQueueIndex = 0;
    })
    .addCase(setQueue, (state, action) => {
      state.queue = action.payload;
      state.currentQueueIndex = 0;
    })

    .addCase(setSearchResults, (state, action) => {
      state.searchResults = action.payload;
    })
    .addCase(setSearchQuery, (state, action) => {
      state.searchQuery = action.payload;
    })
    .addCase(clearSearchResults, (state) => {
      state.searchResults = [];
      state.searchQuery = "";
    })

    .addCase(setCurrentView, (state, action) => {
      state.currentView = action.payload;
    })
    .addCase(setSelectedPlaylist, (state, action) => {
      state.selectedPlaylist = action.payload;
    })

    .addCase(createPlaylist, (state, action) => {
      const newPlaylist = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        tracks: [],
        isPublic: false,
      };
      state.playlists.push(newPlaylist);
    })
    .addCase(deletePlaylist, (state, action) => {
      state.playlists = state.playlists.filter(
        (playlist) => playlist.id !== action.payload
      );
    })
    .addCase(updatePlaylist, (state, action) => {
      const { id, updates } = action.payload;
      const playlist = state.playlists.find((p) => p.id === id);
      if (playlist) {
        Object.assign(playlist, updates);
      }
    })
    .addCase(addToPlaylist, (state, action) => {
      const { playlistId, track } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist && !playlist.tracks.find((t) => t.id === track.id)) {
        playlist.tracks.push(track);
      }
    })
    .addCase(removeFromPlaylist, (state, action) => {
      const { playlistId, trackId } = action.payload;
      const playlist = state.playlists.find((p) => p.id === playlistId);
      if (playlist) {
        playlist.tracks = playlist.tracks.filter((t) => t.id !== trackId);
      }
    })

    .addCase(setLoading, (state, action) => {
      state.isLoading = action.payload;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(clearError, (state) => {
      state.error = null;
    });
});

export default musicReducer;
