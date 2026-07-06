import Editable from "./Editable";

export default function DualBar({ leftPct, leftLabel, rightLabel, onChangeLeftPct }) {
  const left = Math.max(0, Math.min(100, leftPct));
  const right = 100 - left;

  return (
    <div className="py-2.5 first:pt-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-0.5 text-[14px] font-medium text-[var(--tt-text)]">
          <Editable value={left} onChange={onChangeLeftPct} numeric />
          <span>%</span>
        </div>
        <div className="text-[14px] font-medium text-[var(--tt-text)]">{right}%</div>
      </div>
      <div className="h-2 rounded-full overflow-hidden flex bg-[var(--tt-track)]">
        <div className="h-full bg-[var(--tt-accent)]" style={{ width: `${left}%` }} />
        <div className="h-full bg-[var(--tt-accent-light)]" style={{ width: `${right}%` }} />
      </div>
      <div className="flex items-center justify-between mt-1.5 text-[13px] text-[var(--tt-text)]">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
