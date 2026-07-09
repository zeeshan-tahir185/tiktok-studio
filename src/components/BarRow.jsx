import { useEffect, useRef, useState } from "react";
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

export default function BarRow({
  label,
  pct,
  onChangePct,
  onChangeLabel,
  onRemove,
  // States drill-down (Locations-only feature): right-click a row to add a
  // per-row breakdown (e.g. a country's states), revealed via a hover
  // popover on the chevron. `allowStates` gates the right-click menu itself;
  // the chevron/popover only render once `states` actually has entries.
  allowStates = false,
  states,
  onAddStatesFeature,
  onRemoveStatesFeature,
  onAddState,
  onRemoveState,
  onChangeStateLabel,
  onChangeStatePct,
}) {
  const width = Math.max(0, Math.min(100, pct || 0));
  const [menuPos, setMenuPos] = useState(null);
  const hasStates = Boolean(states && states.length);

  // The popover sits a deliberate gap away from the chevron (per the real
  // product's callout style), so a plain CSS group-hover drops the instant
  // the cursor leaves the tiny chevron icon while crossing that gap. Delay
  // the close instead of firing it immediately — re-entering either the
  // chevron or the popover within the delay cancels it.
  const [statesOpen, setStatesOpen] = useState(false);
  const closeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openStates = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setStatesOpen(true);
  };

  const scheduleCloseStates = () => {
    closeTimerRef.current = setTimeout(() => setStatesOpen(false), 300);
  };

  const handleContextMenu = (e) => {
    if (!allowStates) return;
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative group/row py-2.5 first:pt-0" onContextMenu={handleContextMenu}>
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
          {hasStates && (
            <div
              className="relative group/states inline-flex items-center justify-center cursor-zoom-in -ml-1"
              style={{ width: 18, height: 18 }}
              onMouseEnter={openStates}
              onMouseLeave={scheduleCloseStates}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="var(--tt-text)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div
                className={`absolute top-1/2 z-30 transition-opacity bg-white border border-[var(--tt-border)] rounded-lg shadow-lg p-4 cursor-auto ${
                  statesOpen ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
                }`}
                style={{ width: 290, right: 69, transform: "translateY(-50%)" }}
              >
                {/* Callout arrow pointing right, back toward the chevron it belongs to */}
                <span
                  className="absolute bg-white border-[var(--tt-border)]"
                  style={{
                    top: "50%",
                    right: -6,
                    width: 12,
                    height: 12,
                    transform: "translateY(-50%) rotate(45deg)",
                    borderTop: "1px solid var(--tt-border)",
                    borderRight: "1px solid var(--tt-border)",
                  }}
                />
                <div className="relative group/list">
                  {states.map((s, si) => (
                    <BarRow
                      key={si}
                      label={s.label}
                      pct={s.pct}
                      onChangeLabel={(v) => onChangeStateLabel(si, v)}
                      onChangePct={(v) => onChangeStatePct(si, v)}
                      onRemove={states.length > 1 ? () => onRemoveState(si) : undefined}
                    />
                  ))}
                  <div
                    className="absolute -bottom-1 -right-4 group/addRow flex items-center justify-center"
                    style={{ width: 26, height: 26 }}
                  >
                    <button
                      onClick={onAddState}
                      title="Add a state"
                      className="opacity-0 group-hover/addRow:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
                      style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 10, borderRadius: 2, background: "var(--tt-track)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 2, background: "#0075db", width: `${width}%` }} />
      </div>

      {menuPos && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuPos(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuPos(null);
            }}
          />
          <div
            className="fixed z-50 bg-white border border-[var(--tt-border)] rounded-md shadow-lg py-1 text-[13px]"
            style={{ left: menuPos.x, top: menuPos.y, minWidth: 150 }}
          >
            {hasStates ? (
              <button
                className="block w-full text-left px-3 py-1.5 hover:bg-[var(--tt-track)] text-red-500"
                onClick={() => {
                  onRemoveStatesFeature();
                  setMenuPos(null);
                }}
              >
                Remove states
              </button>
            ) : (
              <button
                className="block w-full text-left px-3 py-1.5 hover:bg-[var(--tt-track)] text-[var(--tt-text)]"
                onClick={() => {
                  onAddStatesFeature();
                  setMenuPos(null);
                }}
              >
                Add states
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
