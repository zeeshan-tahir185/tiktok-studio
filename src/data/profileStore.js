const STORAGE_KEY = "tt_profile_picture";

export function getProfilePicture() {
  try {
    return localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function setProfilePicture(dataUrl) {
  localStorage.setItem(STORAGE_KEY, dataUrl);
}
