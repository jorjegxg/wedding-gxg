"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useUploadStore } from "./stores/uploadStore";

export default function GalleryWithUpload() {
  const loading = useUploadStore((state) => state.loading);
  const images = useUploadStore((state) => state.images);
  const fetchImages = useUploadStore((state) => state.fetchImages);
  const uploadFiles = useUploadStore((state) => state.uploadFiles);

  useEffect(() => {
    fetchImages(); // fetch inițial
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

      {/* Grid portret */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {images.map((url, i) => (
          <div
            key={i}
            className="w-full aspect-[3/4] relative rounded overflow-hidden shadow"
          >
            <Image
              src={url}
              alt={`Image ${i}`}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
              priority={i < 6} // primele imagini se încarcă rapid
            />
          </div>
        ))}
      </div>
    </div>
  );
}
