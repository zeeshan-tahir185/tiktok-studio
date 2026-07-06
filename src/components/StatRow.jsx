import Editable from "./Editable";

const TT_FONT =
  '"TikTokFont",system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif,"Roboto","Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';

export default function StatRow({ metrics, activeKey, onSelect, onChangeValue }) {
  return (
    <div className="flex overflow-x-auto">
      {metrics.map((m, i) => {
        const active = m.key === activeKey;
        return (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            className={`flex-1 min-w-[150px] text-center px-5 py-4 border-t-[4px] ${
              i > 0 ? "border-l border-l-[var(--tt-border)]" : ""
            } ${active ? "" : "border-b border-b-[var(--tt-border)]"}`}
            style={{ borderTopColor: active ? "#0075db" : "transparent" }}
          >
            <div
              className="mb-1.5 whitespace-nowrap"
              style={{ fontFamily: TT_FONT, fontSize: 14, fontWeight: 500, color: "#000" }}
            >
              {m.label}
            </div>
            <Editable
              value={m.value}
              onChange={(v) => onChangeValue(m.key, v)}
              className="leading-tight block text-center"
              style={{
                fontFamily: '"TikTok Display"',
                fontSize: 28,
                fontWeight: 500,
                color: active ? "#0075db" : "#000",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
