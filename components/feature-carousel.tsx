"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type FeatureCarouselProps = {
  className?: string;
  intervalMs?: number;
};

export default function FeatureCarousel({
  className,
  intervalMs = 2000,
}: FeatureCarouselProps) {
  const images = useMemo(
    () => [
      {
        src: "/feature_image/Achieve_Financial_Freedom.jpeg",
        alt: "Achieve Financial Freedom",
      },
      {
        src: "/feature_image/Guided_by_Experts.jpeg",
        alt: "Guided by Experts",
      },
      {
        src: "/feature_image/Learn_Anytime_Anywhere.jpeg",
        alt: "Learn Anytime Anywhere",
      },
      {
        src: "/feature_image/Stock_Market_Growth.jpeg",
        alt: "Stock Market Growth",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, intervalMs]);

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden ${
        className ?? ""
      }`}
    >
      <div
        className="h-full w-full"
        style={{
          position: "relative",
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.src}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: index === currentIndex ? 1 : 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 60vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              index === currentIndex ? "bg-white/90" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
