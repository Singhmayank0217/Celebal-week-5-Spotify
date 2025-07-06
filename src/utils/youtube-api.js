export const YOUTUBE_API_KEY =
  import.meta.env.VITE_YOUTUBE_API_KEY ||
  "AIzaSyDnjYdUHgz0GJmW7L2hZykEV-aOfSMYUrY";
export const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3";

export const searchYouTubeVideos = async (query, maxResults = 20) => {
  try {
    const url =
      `${YOUTUBE_API_BASE_URL}/search?` +
      `part=snippet&` +
      `q=${encodeURIComponent(query)}&` +
      `type=video&` +
      `videoCategoryId=10&` +
      `maxResults=${maxResults}&` +
      `key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    throw error;
  }
};

export const convertYouTubeToTrack = (video, index) => {
  const title = video.snippet.title;
  const artist = video.snippet.channelTitle;

  return {
    id: video.id.videoId || video.id,
    title: title,
    artist: artist,
    album: "YouTube",
    duration: "0:00",
    cover:
      video.snippet.thumbnails.medium?.url ||
      video.snippet.thumbnails.default.url,
    youtubeUrl: `https://www.youtube.com/watch?v=${
      video.id.videoId || video.id
    }`,
    youtubeId: video.id.videoId || video.id,
    genre: "Music",
  };
};

export const extractVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};
