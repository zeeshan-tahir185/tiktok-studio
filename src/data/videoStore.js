const STORAGE_KEY = "tt_uploaded_videos";

export function getUploadedVideos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addUploadedVideo({ title, thumbnailUrl }) {
  const videos = getUploadedVideos();
  const entry = {
    id: `up_${Date.now()}`,
    title,
    thumbnailUrl,
    createdAt: Date.now(),
  };
  const next = [entry, ...videos];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return entry;
}

export function deleteUploadedVideo(id) {
  const next = getUploadedVideos().filter((v) => v.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
