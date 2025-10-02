"use client";


import { useUploadStore } from "./stores/uploadStore";


export default function UploadPhotosButton() {
  const loading = useUploadStore((state) => state.loading);
  const uploadFiles = useUploadStore((state) => state.uploadFiles);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFiles(e.target.files);
  };


  return (
    <div>
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
    </div>
  );
}
