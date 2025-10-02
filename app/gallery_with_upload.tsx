"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useUploadStore } from "./stores/uploadStore";

export default function GalleryWithLightbox() {
  const loading = useUploadStore((state) => state.loading);
  const images = useUploadStore((state) => state.images);
  const fetchImages = useUploadStore((state) => state.fetchImages);
  const uploadFiles = useUploadStore((state) => state.uploadFiles);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(e.target.files);
  };

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
            onClick={() => setSelectedImage(url)}
          >
            <Image
              src={url}
              alt={`Image ${i}`}
              fill
              className="object-cover"
              quality={60}
              priority={i < 6}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
    {selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
    onClick={() => setSelectedImage(null)}
  >
    <div className="relative w-full max-w-[500px] max-h-[90vh]">
      <Image
        src={selectedImage}
        alt="Selected"
        width={400}          // lățimea dorită
        height={600}         // portret
        className="object-contain rounded"
      />
    </div>
  </div>
)}


    </div>
  );
}
