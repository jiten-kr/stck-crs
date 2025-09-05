"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

type FeatureCarouselProps = {
  className?: string;
  intervalMs?: number;
};

export default function FeatureCarousel({
  className,
  intervalMs = 3000,
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

  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: intervalMs, stopOnInteraction: false }),
  ]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${
        className ?? ""
      }`}
    >
      {/* Embla viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={image.src}
              className="relative flex-[0_0_100%] w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
