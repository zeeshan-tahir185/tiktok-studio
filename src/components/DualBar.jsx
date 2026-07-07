import Editable from "./Editable";

export default function DualBar({ leftPct, leftLabel, rightLabel, onChangeLeftPct, empty = false }) {
  const left = Math.max(0, Math.min(100, leftPct));
  const right = 100 - left;

  if (empty) {
    return (
      <div className="py-2.5 first:pt-0">
        <div className="flex items-center justify-between mb-1.5">
          <div className="text-[14px] font-medium text-[var(--tt-text)]">-</div>
          <div className="text-[14px] font-medium text-[var(--tt-text)]">-%</div>
        </div>
        <div style={{ height: 10, borderRadius: 2, background: "var(--tt-track)" }} />
        <div className="flex items-center justify-between mt-1.5 text-[13px] text-[var(--tt-text)]">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-2.5 first:pt-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-0.5 text-[14px] font-medium text-[var(--tt-text)]">
          <Editable value={left} onChange={onChangeLeftPct} numeric />
          <span>%</span>
        </div>
        <div className="text-[14px] font-medium text-[var(--tt-text)]">{right}%</div>
      </div>
      <div style={{ height: 10, borderRadius: 2, overflow: "hidden", display: "flex", gap: 2, background: "var(--tt-track)" }}>
        <div style={{ height: "100%", borderRadius: 2, background: "#0075db", width: `${left}%` }} />
        <div style={{ height: "100%", borderRadius: 2, background: "var(--tt-accent-light)", width: `${right}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[13px] text-[var(--tt-text)]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
