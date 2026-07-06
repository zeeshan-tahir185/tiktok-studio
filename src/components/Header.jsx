import { useAnalyticsData } from "../data/DataContext";
import Editable from "./Editable";

const TABS = ["Overview", "Viewers", "Engagement"];

const TT_FONT =
  '"TikTokFont",system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Roboto","Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';

export default function Header({ activeTab, onTabChange }) {
  const { data, updateField } = useAnalyticsData();

  return (
    <div className="sticky top-0 bg-white z-10 flex justify-between px-[32px] h-16 border-b border-[var(--tt-border)]">
      <div className="h-full flex items-center gap-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className="relative h-full flex items-center"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: activeTab === tab ? "#000" : "rgba(0,0,0,.34)",
            }}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 right-0 bottom-0 h-[2.5px] bg-black rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="h-full flex items-center gap-3">
        <div style={{ fontFamily: TT_FONT, fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,.48)" }}>
          Updated on{" "}
          <Editable
            value={data.updatedOn}
            onChange={(v) => updateField(["updatedOn"], v)}
            style={{ fontFamily: TT_FONT, fontSize: 14, fontWeight: 500, color: "rgba(0,0,0,.48)" }}
          />
          .
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500" />
      </div>
    </div>
  );
}
