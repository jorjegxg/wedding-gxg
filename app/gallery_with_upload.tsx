"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useUploadStore } from "./stores/uploadStore";
import { Swiper, SwiperSlide } from "swiper/react";



import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GallerySwiper() {
  const loading = useUploadStore((state) => state.loading);
  const images = useUploadStore((state) => state.images);
  const fetchImages = useUploadStore((state) => state.fetchImages);
  const uploadFiles = useUploadStore((state) => state.uploadFiles);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(e.target.files);
  };

  return (
    <div>
      {/* Input ascuns pentru upload */}
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
            onClick={() => {
              // la click deschidem Swiper pe indexul respectiv
              const swiperEl = document.getElementById("lightboxSwiper") as any;
              if (swiperEl?.swiper) swiperEl.swiper.slideTo(i);
              swiperEl?.classList.remove("hidden");
            }}
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

       {/* 9️⃣ Lightbox Swiper pentru vizualizare imagini mari */}
      <div
        id="lightboxSwiper"
        className="fixed inset-0 bg-black bg-opacity-90 hidden z-50 flex items-center justify-center p-4"
        onClick={(e) => {
          // dacă utilizatorul dă click în afara imaginii, ascundem lightbox-ul
          if (e.target === e.currentTarget) {
            (document.getElementById("lightboxSwiper") as HTMLElement).classList.add("hidden");
          }
        }}
      >
        <Swiper
          centeredSlides={true} // slide-ul curent e centrat
          breakpoints={{
            540: { slidesPerView: 1.5 }, // mobil
            768: { slidesPerView: 2 },   // tablet
            1024: { slidesPerView: 3 },  // desktop
          }}
          spaceBetween={0}
          slidesPerView={1.2}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {images.map((url, i) => (
            <SwiperSlide key={i} className="px-3">
              <div className="relative w-full h-screen flex items-center justify-center">
                <Image
                  src={url}
                  alt={`Image ${i}`}
                  fill
                  sizes="100vw"
                  className="object-contain" // se adaptează la ecran fără să fie decupată
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
