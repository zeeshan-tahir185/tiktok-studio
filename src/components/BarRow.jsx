import Editable from "./Editable";

export default function BarRow({ label, pct, onChangePct, onChangeLabel, chevron = false }) {
  const width = Math.max(0, Math.min(100, pct || 0));
  return (
    <div className="py-2.5 first:pt-0">
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
            value={pct}
            onChange={onChangePct}
            numeric
            className="text-[13px] text-[var(--tt-text)] font-medium"
          />
          <span className="text-[13px] text-[var(--tt-text-secondary)]">%</span>
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
      <div className="h-1.5 rounded-full bg-[var(--tt-track)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--tt-accent)]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
