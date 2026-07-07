import { createContext, useContext, useMemo, useState } from "react";
import { initialData } from "./sampleData";
import { getUploadedVideos, addUploadedVideo as persistUploadedVideo } from "./videoStore";
import { getProfilePicture, setProfilePicture as persistProfilePicture } from "./profileStore";

const DataContext = createContext(null);

function setPath(obj, path, value) {
  const keys = Array.isArray(path) ? path : path.split(".");
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor = clone;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...next };
    cursor = cursor[key];
  }
  cursor[keys[keys.length - 1]] = value;
  return clone;
}

export function DataProvider({ children }) {
  const [data, setData] = useState(initialData);
  const [uploadedVideos, setUploadedVideos] = useState(() => getUploadedVideos());
  const [profilePictureUrl, setProfilePictureUrlState] = useState(() => getProfilePicture());
  const [activeVideoId, setActiveVideoId] = useState(
    () => uploadedVideos[0]?.id ?? initialData.sidebarVideos.find((v) => v.active)?.id
  );

  const updateField = (path, value) => {
    setData((prev) => setPath(prev, path, value));
  };

  const updateListItem = (listPath, index, key, value) => {
    setData((prev) => {
      const keys = Array.isArray(listPath) ? listPath : listPath.split(".");
      const list = keys.reduce((acc, k) => acc[k], prev);
      const newList = list.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      );
      return setPath(prev, keys, newList);
    });
  };

  const sidebarList = useMemo(
    () => [
      ...uploadedVideos.map((v) => ({
        id: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnailUrl,
        active: v.id === activeVideoId,
      })),
      ...data.sidebarVideos.map((v) => ({
        ...v,
        active: v.id === activeVideoId,
      })),
    ],
    [uploadedVideos, data.sidebarVideos, activeVideoId]
  );

  const selectVideo = (id) => {
    setActiveVideoId(id);
    const found = sidebarList.find((v) => v.id === id);
    if (!found) return;
    setData((prev) =>
      setPath(
        setPath(prev, ["video", "caption"], found.title),
        ["video", "thumbnailUrl"],
        found.thumbnailUrl ?? null
      )
    );
  };

  const addUploadedVideo = (title, thumbnailUrl) => {
    const entry = persistUploadedVideo({ title, thumbnailUrl });
    setUploadedVideos((prev) => [entry, ...prev]);
    setActiveVideoId(entry.id);
    setData((prev) =>
      setPath(
        setPath(prev, ["video", "caption"], entry.title),
        ["video", "thumbnailUrl"],
        entry.thumbnailUrl
      )
    );
    return entry;
  };

  const setProfilePictureUrl = (dataUrl) => {
    persistProfilePicture(dataUrl);
    setProfilePictureUrlState(dataUrl);
  };

  const value = useMemo(
    () => ({
      data,
      updateField,
      updateListItem,
      sidebarList,
      activeVideoId,
      selectVideo,
      addUploadedVideo,
      profilePictureUrl,
      setProfilePictureUrl,
    }),
    [data, sidebarList, activeVideoId, profilePictureUrl]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAnalyticsData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAnalyticsData must be used within DataProvider");
  return ctx;
}
