"use client";
import { useRef, useState, useEffect, use } from "react";
import { Play } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";

type Video = {
  src: string;
  thumbnail: string;
  title: string;
  duration?: string;
};

const mockVideos: Video[] = [
  {
    src: "github.com/jitendra-kr/stocks-crypto-edu/raw/refs/heads/main/public/edu/sample.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "github.com/jitendra-kr/stocks-crypto-edu/raw/refs/heads/main/public/edu/sample.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "github.com/jitendra-kr/stocks-crypto-edu/raw/refs/heads/main/public/edu/sample.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "github.com/jitendra-kr/stocks-crypto-edu/raw/refs/heads/main/public/edu/sample.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
  {
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Sample Video",
  },
];
// const [videoDurations, setVideoDurations] = useState<{ [key: string]: string }>({});

const VideoPlayer = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  console.log("VideoPlayer component rendered");

  const [tokens, setTokens] = useState<{
    playback: string;
    thumbnail: string;
    playbackId: string;
  }>({
    playback:
      "eyJhbGciOiJSUzI1NiJ9.eyJraWQiOiJ5WWRqMkJPYm1YcnE3MDBvMDByeHpkNlZ4U0JieERDQVpxVUQwMElETUljWmtRIiwic3ViIjoieVFXc3dGRXEydFR6cnRMQjEwMnc1RGcwMGwzOVBZVDFkSHpQbFBDMDBwRFFqTSIsImF1ZCI6InYiLCJleHAiOjE3NDk0Njk1Mjd9.I0h_wlRJffAFHbfeWZGerF_2Vbao0GJ2BdqjeWk-1_19krGIhifh5nIRKlLH0urWKx1cfMpiT8PZQoljPtQZksGIqcWVhmNGCZexlzt0wxW-RSGlTi1GJoNL19szgfqGGUWMwK6RidxA7CwW_sx3kwWQaXn_0YNIrfAhnF9La5wG67yj6dope1WEZmWXmaeXptUQp8vGCee1oeWAhVZHF9cR_aWAqCe9kBgHFUOeg8-gfJ-U9jPetPPNHk1uYyu5kRgUxAoXL2XxeGST2dZXvy-2XcBpQPKsWt7wd2Dvz21JJRXGTL-A7AWwIIseBEBjEq7hDXW2aEI84L0FphBrzg",
    thumbnail:
      "eyJhbGciOiJSUzI1NiJ9.eyJraWQiOiJ5WWRqMkJPYm1YcnE3MDBvMDByeHpkNlZ4U0JieERDQVpxVUQwMElETUljWmtRIiwic3ViIjoieVFXc3dGRXEydFR6cnRMQjEwMnc1RGcwMGwzOVBZVDFkSHpQbFBDMDBwRFFqTSIsImF1ZCI6InQiLCJleHAiOjE3NDk0Njk1Mjd9.g6kKMv95TB3-otMXvYDYI8V3-UZ0M3AHU9yN1rhSN63rgFpkTHhT8kB6M5NLkix7KGGM86_8rSpIjXlhBxfiVNIMj1EjGDog0HpqbkM9TkIWICIREH_Z0ZW0_le5mownGaKkcljrWAoi_i1NUY3iIYEA1YWuFeEAi7QhhNRzxEa_3H0YvH3pKVp7YS6q1C8O_tVF7T7HTfsd1iMIT17h3C56kvK01O_o35ZclnWXNdRTBbITuh3dF0B_Kj1X7W62UMWHC9tjleZ_bQX3jlg6uklt6tMfDJE6XN11-zYFqSeIu5ZTeNTTaAL6iCJMjRLBXUnLYNBXypoSPE0GCSQIaQ",
    playbackId: "yQWswFEq2tTzrtLB102w5Dg00l39PYT1dHzPlPC00pDQjM",
  });
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

  // console.log("Token fetched successfully:", tokens);
  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch("/api/auth/t");
        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }
        const data = await response.json();
        setTokens({
          playback: data.data.p,
          thumbnail: data.data.t,
          playbackId: data.data.playbackId,
        });
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };
    getToken();
  }, []);

  const [checkingAuth, setCheckingAuth] = useState(true);

  const courseId = useParams()?.id;
  const purchasedCourses = user?.hasPaidFor?.courseIds || [];

  useEffect(() => {
    const isPurchased = purchasedCourses.some((course) => course === courseId);
    console.log("courseId", courseId, "purchasedCourses", purchasedCourses);
    console.log("isPurchased", isPurchased);

    // Simulate auth check delay
    const timeout = setTimeout(() => {
      if (!isAuthenticated || !isPurchased) {
        router.push(`/c`);
      } else {
        setCheckingAuth(false);
      }
    }, 500); // small delay to mimic loading state

    return () => clearTimeout(timeout);
  }, [isAuthenticated, router]);
  const handleVideoSelect = (video: Video) => {};

  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-[60vh] md:h-[70vh] flex flex-col md:flex-row gap-4 p-4">
      {/* Video Player Wrapper */}
      <div className="flex-1 relative rounded-lg overflow-hidden bg-black">
        {mounted && tokens.playback && tokens.thumbnail && (
          <MuxPlayer
            streamType="on-demand"
            playbackId={tokens.playbackId}
            tokens={{
              playback: tokens.playback,
              thumbnail: tokens.thumbnail,
            }}
            preload="metadata"
            _hlsConfig={{
              maxBufferLength: 10, // Maximum buffer length in seconds (e.g., 15 seconds)
              // maxBufferSize: 30 * 1024 * 1024, // Maximum buffer size in bytes (e.g., 30 MB)
              maxMaxBufferLength: 20, // Absolute maximum buffer length in seconds (e.g., 30 seconds)
              // Add any other hls.js config properties here
              // For example, to adjust live latency for live streams:
              // liveSyncDuration: 3, // Target live latency in seconds
              // liveMaxLatencyDuration: 10, // Max live latency before seeking to live edge
            }}
            className="w-full h-full object-cover" // fills parent fully
          />
        )}
      </div>

      {/* Playlist */}
      <div className="w-full md:w-1/3 flex flex-col overflow-y-auto max-h-[30vh] md:max-h-full">
        <h3 className="text-lg font-semibold mb-2">Playlist</h3>
        <div className="flex flex-col gap-2">
          {mockVideos.map((video, index) => (
            <div
              key={index}
              className="flex items-center gap-4 cursor-pointer p-2 border rounded-md hover:bg-gray-200"
              onClick={() => handleVideoSelect(video)}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-20 h-12 object-cover rounded-md"
              />
              <div className="flex flex-col">
                <span className="truncate w-40">{video.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
