import Editable from "./Editable";

export default function StatCard({ label, value, onChange }) {
  return (
    <div className="flex-1 min-w-[140px] rounded-xl border border-[var(--tt-border)] bg-white px-4 py-3.5">
      <div className="text-[13px] text-[var(--tt-text-secondary)] mb-1.5 whitespace-nowrap">
        {label}
      </div>
      <Editable
        value={value}
        onChange={onChange}
        className="text-[22px] font-semibold text-[var(--tt-text)] leading-tight block"
      />
    </div>
  );
}
