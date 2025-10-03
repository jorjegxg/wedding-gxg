// stores/uploadStore.ts
"use client"; // Folosim hooks și Zustand pe partea de client

import { create } from "zustand"; // Zustand pentru state management
import { ref, list, listAll, getDownloadURL, uploadBytesResumable } from "firebase/storage"; // Firebase Storage
import { storage } from "../firebaseConfig"; // Config-ul Firebase
import { listPaginated } from "../utils/firebasePagination"; // Helper care returnează pagini cu imagini

// Definim tipurile pentru store
interface UploadStore {
  loading: boolean; // true când upload sau fetch e în curs
  images: string[]; // array cu URL-urile imaginilor
  lastPageToken: string | null; // token-ul pentru pagina următoare în paginare
  fetchImages: () => Promise<void>; // funcție pentru a încărca prima pagină
  fetchMoreImages: () => Promise<void>; // funcție pentru a încărca următoarele pagini
  uploadFiles: (files: FileList | null) => Promise<void>; // funcție pentru upload de fișiere
}

// Creăm store-ul folosind Zustand
export const useUploadStore = create<UploadStore>((set, get) => ({
  loading: false,   // initial nu se încarcă nimic
  images: [],       // lista de imagini e goală la start
  lastPageToken: null, // nu avem token pentru pagină următoare

  // === Fetch prima pagină de imagini ===
  fetchImages: async () => {
    set({ loading: true }); // setăm loading la true
    try {
      // folosim helper-ul pentru paginare
      const { urls, nextPageToken } = await listPaginated(null); // null înseamnă prima pagină

      // actualizăm store-ul cu imaginile și token-ul pentru pagina următoare
      set({
        images: urls,
        lastPageToken: nextPageToken ?? null, // dacă nu e token, punem null
      });
    } finally {
      set({ loading: false }); // indiferent de succes/eroare, oprim loading
    }
  },

  // === Fetch următoarele pagini ===
  fetchMoreImages: async () => {
    const { lastPageToken, images } = get(); // preluăm starea curentă

    if (!lastPageToken) return; // dacă nu mai avem pagini, ieșim

    set({ loading: true }); // începem loading
    try {
      const { urls, nextPageToken } = await listPaginated(lastPageToken); // fetch next page

      // adăugăm noile imagini la cele existente
      set({
        images: [...images, ...urls],
        lastPageToken: nextPageToken ?? null, // actualizăm token-ul
      });
    } finally {
      set({ loading: false }); // stop loading
    }
  },

  // === Upload fișiere ===
  uploadFiles: async (files) => {
    if (!files) return; // dacă nu sunt fișiere, ieșim
    set({ loading: true }); // start loading

    try {
      // mapăm fiecare fișier într-un upload async
      await Promise.all(
        Array.from(files).map(
          (file) =>
            new Promise<void>((resolve, reject) => {
              // creăm referință în Storage
              const storageRef = ref(storage, `images/${file.name}`);
              const uploadTask = uploadBytesResumable(storageRef, file);

              // ascultăm evenimentele upload-ului
              uploadTask.on(
                "state_changed",
                undefined,        // nu vrem progress aici
                (error) => reject(error), // error handler
                () => resolve()           // success handler
              );
            })
        )
      );

      // După ce upload-ul s-a terminat, reîncărcăm prima pagină
      await get().fetchImages();
    } finally {
      set({ loading: false }); // stop loading
    }
  },
}));
