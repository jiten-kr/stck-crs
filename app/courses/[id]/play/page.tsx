"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useParams, useRouter } from "next/navigation";
import MuxPlayer from "@mux/mux-player-react";
import VideoPlayer from "@/lib/customMuxPlayer";

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

const Player = () => {
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
    playback: "",
    thumbnail: "",
    playbackId: "",
  });
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();

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
          <VideoPlayer
            playbackId={tokens.playbackId}
            tokens={{
              playback: tokens.playback,
              thumbnail: tokens.thumbnail,
            }}
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

export default Player;
