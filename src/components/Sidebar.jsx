import { useAnalyticsData } from "../data/DataContext";

function VideoThumb({ hue }) {
  return (
    <div
      className="shrink-0"
      style={{
        width: 42,
        height: 56,
        borderRadius: 4,
        background: `linear-gradient(160deg, hsl(${hue}, 70%, 62%), hsl(${hue + 30}, 65%, 38%))`,
      }}
    />
  );
}

export default function Sidebar() {
  const { data } = useAnalyticsData();

  return (
    <aside className="w-[250px] shrink-0 border-r border-[var(--tt-border)] bg-[var(--tt-sidebar-bg)] flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-[var(--tt-border)]">
        <img src="/tiktok-studio-logo.png" alt="TikTok Studio" className="h-[28px] w-auto" />
      </div>

      <div className="px-6 py-5 border-b border-[var(--tt-border)]">
        <button className="flex items-center gap-1.5 text-[var(--tt-text)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Back</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-5 scrollbar-hide">
        {data.sidebarVideos.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer hover:bg-[#f5f5f6]"
            style={v.active ? { background: "rgba(0,0,0,0.05)" } : undefined}
          >
            <VideoThumb hue={v.hue} />
            <div className="min-w-0 flex-1 text-[13.5px] text-[var(--tt-text)] leading-snug line-clamp-2">
              {v.title}
            </div>
          </div>
        ))}

        <button className="flex items-center gap-1.5 text-[14px] font-medium text-[var(--tt-text)] px-2 py-4 border-t border-[var(--tt-border)] w-full mt-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to TikTok
        </button>
      </div>
    </aside>
  );
}
