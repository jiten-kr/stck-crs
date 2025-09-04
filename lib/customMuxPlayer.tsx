"use client";

import React from "react";
import MuxPlayer from "@mux/mux-player-react";

type VideoPlayerProps = {
  playbackId: string;
  tokens: {
    playback: string;
    thumbnail: string;
  };
  className?: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  playbackId,
  tokens,
  className,
}) => {
  return (
    <MuxPlayer
      streamType="on-demand"
      playbackId={playbackId}
      tokens={{
        playback: tokens.playback,
        thumbnail: tokens.thumbnail,
      }}
      preload="metadata"
      _hlsConfig={{
        maxBufferLength: 10, // Maximum buffer length in seconds
        maxMaxBufferLength: 20, // Absolute maximum buffer length
        // Add any other hls.js config properties here
        // For example, to adjust live latency for live streams:
        // liveSyncDuration: 3, // Target live latency in seconds
        // liveMaxLatencyDuration: 10, // Max live latency before seeking to live edge
      }}
      className={className ?? "w-full h-full object-cover"}
    />
  );
};

export default VideoPlayer;
