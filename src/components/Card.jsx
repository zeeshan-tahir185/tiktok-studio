import InfoIcon from "./InfoIcon";

export default function Card({ title, divider = true, children }) {
  if (!divider) {
    return (
      <div className="rounded-lg border border-[var(--tt-border)] bg-white p-5">
        <h3 className="text-[16px] font-semibold text-[var(--tt-text)] flex items-center gap-1.5 mb-4">
          {title}
          <InfoIcon />
        </h3>
        {children}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--tt-border)] bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-[var(--tt-border)]">
        <h3 className="text-[16px] font-semibold text-[var(--tt-text)] flex items-center gap-1.5">
          {title}
          <InfoIcon />
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
