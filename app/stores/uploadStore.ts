// stores/uploadStore.ts
import { create } from "zustand";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, db } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface UploadState {
  loading: boolean;
  images: string[]; // lista URL-urilor pentru afișare imediată
  setLoading: (value: boolean) => void;
  setImages: (images: string[]) => void;
  uploadFiles: (files: FileList | null) => Promise<void>;
  fetchImages: () => Promise<void>;
}

export const useUploadStore = create<UploadState>((set, get) => ({
  loading: false,
  images: [],
  setLoading: (value) => set({ loading: value }),
  setImages: (images) => set({ images }),

  // fetch inițial sau refresh
  fetchImages: async () => {
    try {
      const snapshot = await db.collection("images")
        .orderBy("createdAt", "desc")
        .get();

      const urls: string[] = snapshot.docs.map(doc => doc.data().path);
      set({ images: urls });
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  },

  uploadFiles: async (files) => {
    if (!files) return;
    const fileArray = Array.from(files);
    set({ loading: true });

    try {
      await Promise.all(
        fileArray.map((file) => {
          return new Promise<void>(async (resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload ${file.name}: ${progress.toFixed(2)}%`);
              },
              (error) => reject(error),
              async () => {
                const url = await getDownloadURL(storageRef);

                // salvează referința în Firestore
                await db.collection("images").add({
                  path: url,
                  createdAt: serverTimestamp(),
                });

                // adaugă imediat în store pentru refresh instant
                set((state) => ({ images: [url, ...state.images] }));

                resolve();
              }
            );
          });
        })
      );
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      set({ loading: false });
    }
  },
}));
