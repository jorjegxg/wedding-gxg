// utils/firebasePagination.ts
import { ref, list, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

export async function listPaginated(pageToken: string | null) {
  const listRef = ref(storage, "images");

  const result = await list(listRef, {
    maxResults: 12,
    pageToken: pageToken || undefined,
  });

  const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));

  return {
    urls,
    nextPageToken: result.nextPageToken,
  };
}
