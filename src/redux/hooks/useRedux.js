import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentTrack,
  togglePlayPause,
  setVolume,
  setCurrentTime,
  setDuration,
  setIsPlaying,
  addToQueue,
  removeFromQueue,
  setSearchResults,
  setSearchQuery,
  setCurrentView,
  createPlaylist,
  addToPlaylist,
  removeFromPlaylist,
  setSelectedPlaylist,
} from "../actions/musicActions";
import { youtubeApi } from "../../services/youtubeApi";

export const useMusicPlayer = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, volume, currentTime, duration } =
    useSelector((state) => state.music);

  const playTrack = async (track) => {
    console.log(`\n🎵 ===== PLAYING NEW TRACK =====`);
    console.log(`🎵 Title: "${track.title}"`);
    console.log(`🎵 Artist: "${track.artist}"`);
    console.log(`🎵 Album: "${track.album}"`);
    console.log(`🎵 ================================\n`);

    try {
      console.log("🔍 Step 3: Finding unique YouTube video...");
      const youtubeVideo = await youtubeApi.findTrackVideo(
        track.title,
        track.artist
      );

      if (!youtubeVideo || !youtubeVideo.videoId) {
        console.error("❌ No YouTube video found for this track");
        return;
      }

      console.log(`\n✅ ===== YOUTUBE VIDEO FOUND =====`);
      console.log(`📺 Video ID: ${youtubeVideo.videoId}`);
      console.log(`📺 YouTube Title: "${youtubeVideo.title}"`);
      console.log(`📺 Channel: "${youtubeVideo.channelTitle}"`);
      console.log(`📺 Is Fallback: ${youtubeVideo.isFallback ? "Yes" : "No"}`);
      console.log(`📺 ==================================\n`);

      const enhancedTrack = {
        ...track,
        youtubeId: youtubeVideo.videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideo.videoId}`,
        youtubeTitle: youtubeVideo.title,
        youtubeChannel: youtubeVideo.channelTitle,
        youtubeThumbnail: youtubeVideo.thumbnail,
        isFallback: youtubeVideo.isFallback || false,
        searchQuery: youtubeVideo.searchQuery,
        hasPlayback: true,
      };

      console.log(`✅ Enhanced track ready for playback`);

      dispatch(setCurrentTrack(enhancedTrack));

      dispatch(setIsPlaying(true));

      dispatch(setCurrentTime(0));

      console.log("✅ Track set in Redux - YouTube player will load next");
    } catch (error) {
      console.error("❌ Error in playTrack:", error);
    }
  };

  const togglePlay = () => {
    console.log("🎵 Toggling play state. Current:", isPlaying);
    dispatch(togglePlayPause());
  };

  const changeVolume = (newVolume) => {
    console.log("🔊 Changing volume to:", newVolume);
    dispatch(setVolume(newVolume));
  };

  const seekTo = (time) => {
    dispatch(setCurrentTime(time));
  };

  const setTrackDuration = (duration) => {
    console.log("⏱️ Setting track duration:", duration);
    dispatch(setDuration(duration));
  };

  const forcePlay = () => {
    console.log("🎵 Force playing");
    dispatch(setIsPlaying(true));
  };

  const forcePause = () => {
    console.log("⏸️ Force pausing");
    dispatch(setIsPlaying(false));
  };

  return {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playTrack,
    togglePlay,
    changeVolume,
    seekTo,
    setTrackDuration,
    forcePlay,
    forcePause,
  };
};

export const usePlaylists = () => {
  const dispatch = useDispatch();
  const { playlists, selectedPlaylist } = useSelector((state) => state.music);

  const createNewPlaylist = (playlistData) => {
    dispatch(createPlaylist(playlistData));
  };

  const addTrackToPlaylist = (playlistId, track) => {
    dispatch(addToPlaylist({ playlistId, track }));
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    dispatch(removeFromPlaylist({ playlistId, trackId }));
  };

  const selectPlaylist = (playlistId) => {
    dispatch(setSelectedPlaylist(playlistId));
  };

  const getCurrentPlaylist = () => {
    return playlists.find((p) => p.id === selectedPlaylist);
  };

  return {
    playlists,
    selectedPlaylist,
    createNewPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    selectPlaylist,
    getCurrentPlaylist,
  };
};

export const useSearch = () => {
  const dispatch = useDispatch();
  const { searchResults, searchQuery } = useSelector((state) => state.music);

  const updateSearchQuery = (query) => {
    dispatch(setSearchQuery(query));
  };

  const updateSearchResults = (results) => {
    dispatch(setSearchResults(results));
  };

  return {
    searchResults,
    searchQuery,
    updateSearchQuery,
    updateSearchResults,
  };
};

export const useNavigation = () => {
  const dispatch = useDispatch();
  const { currentView } = useSelector((state) => state.music);

  const navigateTo = (view) => {
    dispatch(setCurrentView(view));
  };

  return {
    currentView,
    navigateTo,
  };
};

export const useQueue = () => {
  const dispatch = useDispatch();
  const { queue, currentQueueIndex } = useSelector((state) => state.music);

  const addTrackToQueue = (track) => {
    dispatch(addToQueue(track));
  };

  const removeTrackFromQueue = (trackId) => {
    dispatch(removeFromQueue(trackId));
  };

  return {
    queue,
    currentQueueIndex,
    addTrackToQueue,
    removeTrackFromQueue,
  };
};
