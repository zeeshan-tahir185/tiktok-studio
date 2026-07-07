import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Editable from "./Editable";
import VideoPlayPreview from "./VideoPlayPreview";

const CHART_HEIGHT = 50;
const CHART_MARGIN_TOP = 6;

function formatPct(v) {
  return `${Math.round(v)}%`;
}

function parsePct(text) {
  const match = String(text).match(/-?[\d.]+/);
  if (!match) return null;
  const num = parseFloat(match[0]);
  return Number.isNaN(num) ? null : num;
}

function CustomDot({ cx, cy, index, selectedIndex, onPosition }) {
  const isSelected = index === selectedIndex;
  useEffect(() => {
    if (isSelected && cx != null && cy != null) onPosition(index, { x: cx, y: cy });
  }, [isSelected, cx, cy, index]);
  if (cx == null || cy == null || !isSelected) return null;
  return <circle cx={cx} cy={cy} r={2.5} fill="#fff" stroke="var(--tt-accent)" strokeWidth={1.25} />;
}

// Reports which point is hovered (by label match) — mirrors the main
// trend chart's TooltipCapture so hovering anywhere near a point (not
// just its tiny dot) reveals the tooltip, same as the main chart.
function TooltipCapture({ active, payload, label, data, onActive }) {
  useEffect(() => {
    if (active && payload && payload.length) {
      const idx = data.findIndex((d) => d.t === label);
      onActive(idx);
    }
  }, [active, label]);
  return null;
}

export default function RetentionChart({
  sentence,
  peakTime,
  onChangePeakTime,
  duration,
  onChangeDuration,
  startTime,
  onChangeStartTime,
  yMax,
  yTickCount,
  onChangeYTick,
  onAddYTick,
  onRemoveYTick,
  data,
  onChangeY,
  thumbnailUrl,
}) {
  const firstPct = data[0]?.pct ?? 0;
  const [scrub, setScrub] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [positions, setPositions] = useState({});

  const step = yMax / yTickCount;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => (i + 1) * step);
  const topFor = (v) => CHART_MARGIN_TOP + (CHART_HEIGHT - CHART_MARGIN_TOP) * (1 - v / yMax);

  const handlePosition = (index, pos) => {
    setPositions((prev) => {
      const existing = prev[index];
      if (existing && existing.x === pos.x && existing.y === pos.y) return prev;
      return { ...prev, [index]: pos };
    });
  };
  const pinnedPos = selectedIndex != null ? positions[selectedIndex] : null;

  return (
    <div>
      <div className="text-[13px] text-[var(--tt-text-secondary)] mb-4">
        {sentence.before}{" "}
        <Editable
          as="span"
          value={peakTime}
          onChange={onChangePeakTime}
          className="text-[var(--tt-text)] font-medium"
        />
        {sentence.after}
      </div>

      <VideoPlayPreview thumbnailUrl={thumbnailUrl} />

      <div className="relative mt-4 group/rchart" onMouseLeave={() => setSelectedIndex(null)}>
        {yTicks.map((v, i) => (
          <div key={i} className="absolute left-0 right-9 border-t border-dashed border-[#e5e6e9]" style={{ top: topFor(v) }} />
        ))}
        {yTicks.map((v, i) => (
          <div
            key={i}
            className="absolute right-0 z-10 -translate-y-1/2 group/ytick"
            style={{ top: topFor(v) }}
          >
            <div className="relative flex items-center">
              <Editable
                value={formatPct(v)}
                onChange={(text) => {
                  const parsed = parsePct(text);
                  if (parsed !== null && parsed > 0) onChangeYTick(i, parsed);
                }}
                className="text-[11px] text-[var(--tt-text-secondary)]"
              />
              {yTickCount > 1 && (
                <button
                  onClick={() => onRemoveYTick(i)}
                  className="absolute -right-4 opacity-0 group-hover/ytick:opacity-100 text-[10px] leading-none text-[var(--tt-text-secondary)] hover:text-red-500"
                  style={{ width: 10, height: 10 }}
                  title="Remove this value"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
        <div
          className="absolute -right-4 z-10 group/addYTick flex items-center justify-center"
          style={{ width: 24, height: 24, top: -28 }}
        >
          <button
            onClick={onAddYTick}
            title="Add a value"
            className="opacity-0 group-hover/addYTick:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
            style={{ width: 16, height: 16, fontSize: 11, lineHeight: 1 }}
          >
            +
          </button>
        </div>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={data} margin={{ top: CHART_MARGIN_TOP, right: 34, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tt-accent)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--tt-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide domain={[0, yMax]} />
            <Tooltip
              content={(props) => (
                <TooltipCapture {...props} data={data} onActive={setSelectedIndex} />
              )}
              cursor={false}
              isAnimationActive={false}
            />
            <Area
              type="linear"
              dataKey="pct"
              stroke="var(--tt-accent)"
              strokeWidth={1}
              fill="url(#retentionFill)"
              isAnimationActive={false}
              activeDot={false}
              dot={(props) => (
                <CustomDot
                  {...props}
                  selectedIndex={selectedIndex}
                  onPosition={handlePosition}
                />
              )}
            />
          </AreaChart>
        </ResponsiveContainer>

        {pinnedPos && (
          <>
            <div
              className="absolute border-l border-dashed border-[#ccc] pointer-events-none"
              style={{
                left: pinnedPos.x,
                top: CHART_MARGIN_TOP,
                height: Math.max(0, pinnedPos.y - CHART_MARGIN_TOP),
                transition: "left 0.15s ease-out, height 0.15s ease-out",
              }}
            />
            <div
              className="absolute z-20"
              style={{
                left: pinnedPos.x,
                top: pinnedPos.y,
                transition: "left 0.15s ease-out, top 0.15s ease-out",
                transform:
                  selectedIndex === 0
                    ? "translate(0%, calc(-100% - 10px))"
                    : selectedIndex === data.length - 1
                    ? "translate(-100%, calc(-100% - 10px))"
                    : "translate(-50%, calc(-100% - 10px))",
              }}
            >
              <div className="bg-white border border-[var(--tt-border)] rounded-lg shadow-md px-3 py-2 text-center">
                <div className="text-[12px] text-[var(--tt-text-secondary)]">
                  {data[selectedIndex].t}
                </div>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                  <span className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[var(--tt-accent)] bg-white shrink-0" />
                  <Editable
                    value={formatPct(data[selectedIndex].pct)}
                    onChange={(text) => {
                      const parsed = parsePct(text);
                      if (parsed !== null) onChangeY(selectedIndex, parsed);
                    }}
                    className="text-[15px] font-semibold text-black"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="h-4 flex items-center">
        <input
          type="range"
          min={0}
          max={100}
          value={scrub}
          onChange={(e) => setScrub(Number(e.target.value))}
          className="range-scrub w-full"
        />
      </div>

      <div className="flex items-center justify-between text-[12px] text-[var(--tt-text-secondary)]">
        <span>
          <Editable as="span" value={startTime} onChange={onChangeStartTime} /> ({firstPct}%)
        </span>
        <Editable value={duration} onChange={onChangeDuration} />
      </div>
    </div>
  );
}
