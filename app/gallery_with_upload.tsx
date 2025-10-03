"use client"; // Folosim hooks și interactivitate pe client-side

import { useEffect, useRef, useState } from "react";
import Image from "next/image"; // Next.js Image pentru optimizare
import { useUploadStore } from "./stores/uploadStore"; // Zustand store
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper pentru slider/lightbox
import { Navigation, Pagination } from "swiper/modules"; // Module Swiper pentru navigation & pagination

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Download } from "lucide-react"; // icon download
import { forceDownload } from "./utils/download"; // funcție custom pentru descărcare

export default function GallerySwiper() {
  const loading = useUploadStore((state) => state.loading);
  const images = useUploadStore((state) => state.images);
  const fetchImages = useUploadStore((state) => state.fetchImages);
  const fetchMoreImages = useUploadStore((state) => state.fetchMoreImages);
  const lastPageToken = useUploadStore((state) => state.lastPageToken);

  const [showLightbox, setShowLightbox] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  // === Detectare scroll aproape de final pentru infinite scroll ===
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || loading || !lastPageToken) return;

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

      // dacă scroll-ul e la 300px de final, încarcă mai multe
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        fetchMoreImages();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, lastPageToken]);

  return (
    <div ref={containerRef}>
      {/* grid-ul imaginilor */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {images.map((url, i) => (
          <div
            key={i}
            className="w-full aspect-[2/3] relative rounded overflow-hidden shadow cursor-pointer"
            onClick={() => {
              setActiveIndex(i);
              setShowLightbox(true);
            }}
          >
            <Image
              src={url}
              alt={`Image ${i}`}
              fill
              sizes="75vw"
              className="object-cover"
              quality={60}
              priority={i < 6}
            />
          </div>
        ))}
      </div>

      {/* Spinner */}
      {loading && (
        <div className="flex justify-center mt-6">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}


      {/* === Lightbox (overlay cu Swiper) === */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          {/* === Buton X pentru închidere === */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white text-3xl font-bold z-50"
          >
            ✕
          </button>

          <Swiper
            modules={[Navigation, Pagination]}  // navigation + pagination
            navigation
            pagination={{ clickable: true }}
            initialSlide={activeIndex}          // începe de la imaginea selectată
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // actualizează indexul activ
            className="w-full h-full"
          >
            {images.map((url, i) => (
              <SwiperSlide key={i}>
                <div className="relative w-full h-screen flex items-center justify-center">
                  
                  {/* === Buton Download în stânga sus === */}
                  <button
                    onClick={() => forceDownload(url, `poza-${i}.jpg`)}
                    className="absolute top-4 left-4 p-2 bg-white text-black rounded-full shadow hover:scale-110 transition z-50"
                  >
                    <Download className="w-6 h-6" />
                  </button>

                  {/* === Imagine mare în lightbox === */}
                  <Image
                    src={url}
                    alt={`Image ${i}`}
                    fill
                    sizes="100vw"      // ocupă tot viewport-ul
                    className="object-contain"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
}
