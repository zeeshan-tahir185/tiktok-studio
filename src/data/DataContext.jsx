import { createContext, useContext, useMemo, useState } from "react";
import { initialData } from "./sampleData";

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

  const value = useMemo(
    () => ({ data, updateField, updateListItem }),
    [data]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useAnalyticsData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useAnalyticsData must be used within DataProvider");
  return ctx;
}
