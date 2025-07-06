import { createAction } from "@reduxjs/toolkit";

export const setCurrentTrack = createAction("music/setCurrentTrack");
export const togglePlayPause = createAction("music/togglePlayPause");
export const setIsPlaying = createAction("music/setIsPlaying");
export const setVolume = createAction("music/setVolume");
export const setCurrentTime = createAction("music/setCurrentTime");
export const setDuration = createAction("music/setDuration");

export const addToQueue = createAction("music/addToQueue");
export const removeFromQueue = createAction("music/removeFromQueue");
export const clearQueue = createAction("music/clearQueue");
export const setQueue = createAction("music/setQueue");

export const setSearchResults = createAction("music/setSearchResults");
export const setSearchQuery = createAction("music/setSearchQuery");
export const clearSearchResults = createAction("music/clearSearchResults");

export const setCurrentView = createAction("music/setCurrentView");
export const setSelectedPlaylist = createAction("music/setSelectedPlaylist");

export const createPlaylist = createAction("music/createPlaylist");
export const deletePlaylist = createAction("music/deletePlaylist");
export const updatePlaylist = createAction("music/updatePlaylist");
export const addToPlaylist = createAction("music/addToPlaylist");
export const removeFromPlaylist = createAction("music/removeFromPlaylist");

export const setLoading = createAction("music/setLoading");
export const setError = createAction("music/setError");
export const clearError = createAction("music/clearError");
