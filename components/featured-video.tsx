"use client";

import React, { useMemo } from "react";

type FeaturedVideoProps = {
  className?: string;
};

export default function FeaturedVideo({ className }: FeaturedVideoProps) {
  const muxSrc = useMemo(() => {
    const base =
      "https://player.mux.com/2tTEB02b8hSYgstRlEpjI5orTkEnWmmZnAhCAf00Tt00oA";
    const params = new URLSearchParams({
      autoplay: "true",
      muted: "false",
      loop: "true",
      controls: "false",
      playsinline: "true",
      preload: "auto",
    });
    return `${base}?${params.toString()}`;
  }, []);

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden ${
        className ?? ""
      }`}
    >
      <iframe
        src={muxSrc}
        title="C0258"
        className="w-full h-full"
        style={{ border: "none" }}
        allow="autoplay; encrypted-media;"
      />
    </div>
  );
}
