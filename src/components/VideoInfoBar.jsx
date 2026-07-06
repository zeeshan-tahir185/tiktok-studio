import Editable from "./Editable";
import { useAnalyticsData } from "../data/DataContext";

const TT_FONT =
  '"TikTokFont",system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Roboto","Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';

const ICONS = {
  play: (
    <svg style={{ width: "1em", height: "1em" }} fill="currentColor" viewBox="0 0 48 48">
      <path d="M45.08 25.84a4.5 4.5 0 0 0 0-3.67 4.82 4.82 0 0 0-1.75-1.91c-.7-.5-1.64-1.04-2.78-1.69L18.87 6.14c-1.12-.65-2.06-1.19-2.83-1.54a4.82 4.82 0 0 0-2.52-.55 4.5 4.5 0 0 0-3.16 1.84c-.53.73-.7 1.6-.78 2.45-.08.85-.08 1.93-.08 3.22v24.88c0 1.3 0 2.37.08 3.22.08.86.25 1.73.78 2.45a4.5 4.5 0 0 0 3.16 1.84c.9.1 1.74-.2 2.52-.55.77-.35 1.7-.89 2.83-1.53l21.68-12.44c1.14-.65 2.08-1.2 2.78-1.69.7-.5 1.38-1.08 1.75-1.9Z" />
    </svg>
  ),
  heart: (
    <svg style={{ width: "1em", height: "1em" }} fill="currentColor" viewBox="0 0 48 48">
      <path d="M24 9.44c3.2-4.03 7.61-5.56 12-4.67 2.31.47 5.59 2.28 7.75 5.48 2.26 3.32 3.21 7.99.98 13.85-1.75 4.57-5.5 8.83-9.28 12.2a56.6 56.6 0 0 1-10.52 7.47l-.93.49-.93-.49a56.6 56.6 0 0 1-10.52-7.47c-3.78-3.37-7.53-7.63-9.28-12.2-2.23-5.86-1.28-10.53.98-13.85C6.4 7.05 9.69 5.24 12 4.77c4.39-.9 8.8.64 12 4.67Z" />
    </svg>
  ),
  comment: (
    <svg style={{ width: "1em", height: "1em" }} fill="currentColor" viewBox="0 0 48 48">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 21.5c0-10.22 9.88-18 22-18s22 7.78 22 18c0 5.63-3.19 10.74-7.32 14.8a43.55 43.55 0 0 1-14.14 9.1A1.5 1.5 0 0 1 22.5 44v-5.04C11.13 38.4 2 31.34 2 21.5ZM14 25a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13-3a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  ),
  share: (
    <svg style={{ width: "1em", height: "1em" }} fill="currentColor" viewBox="0 0 48 48">
      <path d="M23.82 3.5A2 2 0 0 0 20.5 5v10.06C8.7 15.96 1 25.32 1 37a2 2 0 0 0 3.41 1.41c4.14-4.13 10.4-5.6 16.09-5.88v9.97a2 2 0 0 0 3.3 1.52l21.5-18.5a2 2 0 0 0 .02-3.02l-21.5-19Z" />
    </svg>
  ),
  bookmark: (
    <svg style={{ width: "1em", height: "1em" }} fill="currentColor" viewBox="0 0 48 48">
      <path d="M13 4a5 5 0 0 0-5 5v32.8a2 2 0 0 0 3.26 1.55l12.1-9.84a1 1 0 0 1 1.27 0l12.1 9.84A2 2 0 0 0 40 41.8V9a5 5 0 0 0-5-5H13Z" />
    </svg>
  ),
};

export default function VideoInfoBar() {
  const { data, updateField } = useAnalyticsData();
  const v = data.video;

  const statFields = [
    ["plays", "play"],
    ["likes", "heart"],
    ["comments", "comment"],
    ["shares", "share"],
    ["bookmarks", "bookmark"],
  ];

  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--tt-border)]">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="shrink-0"
          style={{
            width: 42,
            height: 56,
            borderRadius: 4,
            background: "linear-gradient(160deg, #6ea8ff, #2e5fd9)",
          }}
        />
        <div className="min-w-0">
          <Editable
            value={v.caption}
            onChange={(val) => updateField(["video", "caption"], val)}
            className="text-[var(--tt-text)] truncate block max-w-[520px]"
            style={{ fontFamily: TT_FONT, fontSize: 14, fontWeight: 500 }}
          />
          <Editable
            value={v.postedDate}
            onChange={(val) => updateField(["video", "postedDate"], val)}
            className="block mt-0.5"
            style={{ fontFamily: TT_FONT, fontSize: 12, color: "rgba(0,0,0,.48)" }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-10" style={{ color: "rgba(0,0,0,.25)" }}>
        {statFields.map(([key, icon]) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span>{ICONS[icon]}</span>
            <Editable
              value={v.stats[key]}
              onChange={(val) => updateField(["video", "stats", key], val)}
              className="block"
              style={{ fontFamily: TT_FONT, fontSize: 13, color: "rgba(0,0,0,.25)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
