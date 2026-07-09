import Editable from "./Editable";

// Anything under 0.1% displays as "<0.1" (matches the real product's
// convention for near-zero values) instead of a bare "0". The leading "<"
// is parsed back out on commit so leaving the field untouched doesn't drift
// the value up to 0.1 — see parsePct below.
function formatPct(pct) {
  return pct < 0.1 ? "<0.1" : String(pct);
}

function parsePct(text) {
  const trimmed = String(text).trim();
  const match = trimmed.match(/-?[\d.]+/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  if (Number.isNaN(num)) return null;
  return trimmed.startsWith("<") ? 0 : num;
}

export default function BarRow({ label, pct, onChangePct, onChangeLabel, chevron = false, onRemove }) {
  const width = Math.max(0, Math.min(100, pct || 0));
  return (
    <div className="relative group/row py-2.5 first:pt-0">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -right-4 top-3 opacity-0 group-hover/row:opacity-100 text-[10px] leading-none text-[var(--tt-text-secondary)] hover:text-red-500"
          style={{ width: 10, height: 10 }}
          title="Remove this entry"
        >
          ×
        </button>
      )}
      <div className="flex items-center justify-between mb-1.5">
        {onChangeLabel ? (
          <Editable
            value={label}
            onChange={onChangeLabel}
            className="text-[13px] text-[var(--tt-text)] truncate pr-2"
          />
        ) : (
          <div className="text-[13px] text-[var(--tt-text)] truncate pr-2">{label}</div>
        )}
        <div className="shrink-0 flex items-center gap-1">
          <Editable
            value={formatPct(pct)}
            onChange={(text) => {
              const parsed = parsePct(text);
              if (parsed !== null) onChangePct(parsed);
            }}
            className="text-[13px] text-[var(--tt-text)] font-medium"
          />
          <span className="text-[13px] text-[var(--tt-text)] font-medium">%</span>
          {chevron && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-0.5">
              <path
                d="M9 6l6 6-6 6"
                stroke="var(--tt-text-secondary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <div style={{ height: 10, borderRadius: 2, background: "var(--tt-track)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: "#0075db", width: `${width}%` }} />
      </div>
    </div>
  );
}
