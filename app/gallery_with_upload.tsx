"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useUploadStore } from "./stores/uploadStore";

export default function GalleryWithLightbox() {
  const loading = useUploadStore((state) => state.loading);
  const images = useUploadStore((state) => state.images);
  const fetchImages = useUploadStore((state) => state.fetchImages);
  const uploadFiles = useUploadStore((state) => state.uploadFiles);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(e.target.files);
  };

  const closeLightbox = () => setCurrentIndex(null);

  const showPrev = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length]);

  const showNext = useCallback(() => {
    if (currentIndex === null) return;
    setCurrentIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length]);

  // navigare cu taste
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (currentIndex === null) return;
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, showPrev, showNext]);

  return (
    <div>
      {/* Input ascuns */}
      <input
        type="file"
        id="fileUpload"
        accept="image/*"
        multiple
        disabled={loading}
        onChange={handleFiles}
        style={{ display: "none" }}
      />

      {/* Floating Action Button */}
      <label
        htmlFor="fileUpload"
        className="
          fixed bottom-6 right-6
          flex items-center gap-3
          px-5 py-3
          bg-white text-black
          rounded-full shadow-lg
          cursor-pointer
          hover:shadow-xl hover:scale-105
          transition-all duration-200 ease-in-out
        "
      >
        <span className="text-lg font-medium">
          {loading ? "Uploading..." : "Adaugă poze"}
        </span>
        <span className="text-2xl">📷</span>
      </label>

      {/* Grid imagini */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6">
        {images.map((url, i) => (
          <div
            key={i}
            className="w-full aspect-[2/3] relative rounded overflow-hidden shadow cursor-pointer"
            onClick={() => setCurrentIndex(i)}
          >
            <Image
              src={url}
              alt={`Image ${i}`}
              fill
              sizes="100vw"
              className="object-cover"
              quality={60}
              priority={i < 6}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {currentIndex !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <Image
              src={images[currentIndex]}
              alt="Selected"
              width={400}
              height={600}
              className="object-contain rounded"
            />

            {/* Butoane navigare */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl font-bold"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
