"use client";

import { useEffect, useRef, useState } from "react";
import { useMusicPlayer } from "../../redux/hooks/useRedux";

export default function YouTubePlayer({ videoId, onReady, onStateChange }) {
  const { isPlaying, volume, seekTo, setTrackDuration, forcePlay, forcePause } =
    useMusicPlayer();
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isAPIReady, setIsAPIReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const timeTrackingRef = useRef(null);
  const isSeekingRef = useRef(false);
  const lastUpdateTimeRef = useRef(0);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsAPIReady(true);
      return;
    }

    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.head.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log("✅ YouTube API Ready!");
      setIsAPIReady(true);
    };

    return () => {
      stopTimeTracking();
    };
  }, []);

  const startTimeTracking = () => {
    if (timeTrackingRef.current) {
      clearInterval(timeTrackingRef.current);
    }

    timeTrackingRef.current = setInterval(() => {
      if (playerRef.current && playerReady && !isSeekingRef.current) {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          if (currentTime && !isNaN(currentTime) && currentTime > 0) {
            seekTo(currentTime);
          }
        } catch (error) {}
      }
    }, 1000);
  };

  const stopTimeTracking = () => {
    if (timeTrackingRef.current) {
      clearInterval(timeTrackingRef.current);
      timeTrackingRef.current = null;
    }
  };

  useEffect(() => {
    if (!isAPIReady || !videoId) return;

    if (currentVideoId === videoId && playerRef.current && playerReady) {
      return;
    }

    console.log(`🎬 Loading video: ${videoId}`);
    setCurrentVideoId(videoId);
    setPlayerReady(false);
    stopTimeTracking();

    if (playerRef.current) {
      try {
        playerRef.current.loadVideoById(videoId);
        return;
      } catch (error) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    }

    setTimeout(() => {
      if (!containerRef.current) return;

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: "1",
          width: "1",
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 0,
            controls: 0,
            modestbranding: 1,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              console.log(`✅ Player ready: ${videoId}`);
              setPlayerReady(true);

              try {
                const duration = event.target.getDuration();
                if (duration > 0) {
                  setTrackDuration(duration);
                }
                event.target.setVolume(volume);
                event.target.playVideo();

                window.youtubePlayer = playerRef.current;
                window.youtubePlayerSeek = (time) => {
                  if (playerRef.current && playerReady) {
                    isSeekingRef.current = true;
                    playerRef.current.seekTo(time, true);
                    setTimeout(() => {
                      isSeekingRef.current = false;
                    }, 1000);
                  }
                };

                if (onReady) onReady(event);
              } catch (error) {
                console.log("Error in onReady:", error);
              }
            },
            onStateChange: (event) => {
              const state = event.data;

              if (state === window.YT.PlayerState.PLAYING) {
                forcePlay();
                startTimeTracking();
              } else if (state === window.YT.PlayerState.PAUSED) {
                forcePause();
                stopTimeTracking();
              } else if (state === window.YT.PlayerState.ENDED) {
                forcePause();
                stopTimeTracking();
              }

              if (onStateChange) onStateChange(state);
            },
            onError: (event) => {
              console.error(`❌ Player error: ${event.data}`);
              setPlayerReady(false);
              stopTimeTracking();
            },
          },
        });
      } catch (error) {
        console.error("❌ Error creating player:", error);
      }
    }, 100);
  }, [isAPIReady, videoId]);

  useEffect(() => {
    if (!playerRef.current || !playerReady) return;

    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (error) {}
  }, [isPlaying, playerReady]);

  useEffect(() => {
    if (playerRef.current && playerReady) {
      try {
        playerRef.current.setVolume(volume);
      } catch (error) {}
    }
  }, [volume, playerReady]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: "-100px",
        left: "-100px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
