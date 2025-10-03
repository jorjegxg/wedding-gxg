// utils/download.ts
export async function forceDownload(url: string, filename: string) {
  try {
    const response = await fetch(url, { mode: "cors" }); // preia fișierul
    const blob = await response.blob();                  // îl transformă în blob
    const blobUrl = URL.createObjectURL(blob);           // creează un URL temporar

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;                            // numele fișierului salvat
    document.body.appendChild(link);
    link.click();                                        // simulăm click pe link
    link.remove();
    URL.revokeObjectURL(blobUrl);                        // cleanup
  } catch (err) {
    console.error("Download error:", err);
  }
}
