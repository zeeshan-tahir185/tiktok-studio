import InfoIcon from "./InfoIcon";

export default function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-[var(--tt-border)] bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--tt-border)]">
        <h3 className="text-[15px] font-semibold text-[var(--tt-text)] flex items-center gap-1.5">
          {title}
          <InfoIcon />
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
