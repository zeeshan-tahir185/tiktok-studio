import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Editable from "./Editable";

const CHART_HEIGHT = 220;
const TICK_PROPORTIONS = [0, 0.25, 0.5, 0.75, 1];

function pickIndices(data) {
  if (data.length <= 3) return data.map((_, i) => i);
  const mid = Math.floor((data.length - 1) / 2);
  return [0, mid, data.length - 1];
}

function niceMax(max) {
  if (max <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
  return niceNorm * mag;
}

function formatTick(v, kind) {
  switch (kind) {
    case "compact":
      return Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${Math.round(v)}`;
    case "hours":
      return `${Math.round(v * 10) / 10}h`;
    case "seconds":
      return `${Math.round(v * 10) / 10}s`;
    case "percent":
      return `${Math.round(v * 10) / 10}%`;
    default:
      return `${Math.round(v)}`;
  }
}

// Parses whatever the user typed back into a plain number, honoring the
// same unit suffix the metric displays (k/m for compact, h/s/% otherwise
// are just stripped) — the inverse of formatTick.
function parseAxisValue(text, kind) {
  const match = String(text).match(/-?[\d.]+/);
  if (!match) return null;
  let num = parseFloat(match[0]);
  if (Number.isNaN(num)) return null;
  if (kind === "compact") {
    if (/m/i.test(text)) num *= 1000000;
    else if (/k/i.test(text)) num *= 1000;
  }
  return num;
}

// Reports which point is hovered (by label match) — not its pixel
// position, since Recharts' reported coordinate.y is unreliable here.
function TooltipCapture({ active, payload, label, chartData, onActive }) {
  useEffect(() => {
    if (active && payload && payload.length) {
      const localIndex = chartData.findIndex((d) => d.date === label);
      onActive(localIndex);
    }
  }, [active, label]);
  return null;
}

// Captures the ACTUAL rendered cx/cy of each of the 3 dots — this is the
// one source of truth for on-screen position, tied to the real data value
// (not the mouse), so the tooltip box anchors exactly above the point.
function CapturingDot({ cx, cy, index, onPosition }) {
  useEffect(() => {
    if (cx != null && cy != null) onPosition(index, { x: cx, y: cy });
  }, [cx, cy, index]);
  if (cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={3} fill="#fff" stroke="var(--tt-accent)" strokeWidth={1.5} />;
}

function EditableXTick({ x, y, payload, index, lastIndex, onChangeDate }) {
  const width = 74;
  let boxX = x - width / 2;
  let align = "center";
  if (index === 0) {
    boxX = x;
    align = "left";
  } else if (index === lastIndex) {
    boxX = x - width;
    align = "right";
  }
  return (
    <foreignObject x={Math.round(boxX)} y={Math.round(y + 4)} width={width} height={20}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{ textAlign: align, whiteSpace: "nowrap", lineHeight: "16px" }}
      >
        <Editable
          value={payload.value}
          onChange={(v) => onChangeDate(index, v)}
          className="text-[11px] text-[var(--tt-text-secondary)] inline-block"
        />
      </div>
    </foreignObject>
  );
}

// Every tick's displayed value is always yAxisMax * its fixed proportion —
// so labels can never drift out of sync with where they're actually drawn.
// Editing a tick solves for the new yAxisMax that keeps that same identity
// true, then the whole scale (and the plotted line) updates to match.
function EditableYTick({ x, y, index, yAxisMax, yTickFormatter, onChangeYAxisMax }) {
  if (index === 0) return null;
  const proportion = TICK_PROPORTIONS[index];
  const display = formatTick(yAxisMax * proportion, yTickFormatter);
  return (
    <foreignObject x={Math.round(x)} y={Math.round(y - 8)} width={46} height={16}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{ whiteSpace: "nowrap", lineHeight: "16px" }}>
        <Editable
          value={display}
          onChange={(text) => {
            const parsed = parseAxisValue(text, yTickFormatter);
            if (parsed !== null && parsed > 0) onChangeYAxisMax(parsed / proportion);
          }}
          className="text-[11px] text-[var(--tt-text-secondary)] inline-block"
        />
      </div>
    </foreignObject>
  );
}

export default function AreaTrendChart({
  data,
  onChangeY,
  onChangeDate,
  yAxisMax,
  onChangeYAxisMax,
  yTickFormatter = "plain",
}) {
  const [activeLocalIndex, setActiveLocalIndex] = useState(null);
  const [positions, setPositions] = useState({});

  // Only 3 real nodes exist on this chart — matching the 3 dates shown —
  // so there is nothing hidden left to hover/tooltip on.
  const tickIndices = pickIndices(data);
  const chartData = tickIndices.map((i) => data[i]);

  // Fall back to an auto "nice" max only if the metric has no stored
  // yAxisMax yet (e.g. older saved data) — once set, it's the sole source
  // of truth for where every tick and every data point is plotted.
  const effectiveMax = yAxisMax ?? niceMax(Math.max(...chartData.map((d) => d.value), 1));
  const yTicks = TICK_PROPORTIONS.map((p) => effectiveMax * p);

  const handlePosition = (index, pos) => {
    setPositions((prev) => {
      const existing = prev[index];
      if (existing && existing.x === pos.x && existing.y === pos.y) return prev;
      return { ...prev, [index]: pos };
    });
  };

  const pinnedOriginalIndex =
    activeLocalIndex != null ? tickIndices[activeLocalIndex] : null;
  const pinnedPos = activeLocalIndex != null ? positions[activeLocalIndex] : null;

  return (
    <div className="relative" onMouseLeave={() => setActiveLocalIndex(null)}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <AreaChart data={chartData} margin={{ top: 26, right: 10, left: 8, bottom: 10 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--tt-accent)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="var(--tt-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            strokeDasharray="1 3"
            strokeLinecap="round"
            stroke="#a9aab0"
          />
          <XAxis
            dataKey="date"
            interval={0}
            tick={(props) => (
              <EditableXTick
                {...props}
                lastIndex={chartData.length - 1}
                onChangeDate={(i, v) => onChangeDate(tickIndices[i], v)}
              />
            )}
            axisLine={{ stroke: "#eee" }}
            tickLine={false}
            padding={{ right: 20 }}
          />
          <YAxis
            orientation="right"
            domain={[0, effectiveMax]}
            ticks={yTicks}
            axisLine={false}
            tickLine={false}
            width={46}
            tick={(props) => (
              <EditableYTick
                {...props}
                yAxisMax={effectiveMax}
                yTickFormatter={yTickFormatter}
                onChangeYAxisMax={onChangeYAxisMax}
              />
            )}
          />
          <Tooltip
            content={(props) => (
              <TooltipCapture {...props} chartData={chartData} onActive={setActiveLocalIndex} />
            )}
            cursor={{ stroke: "#ccc", strokeDasharray: "4 4" }}
            isAnimationActive={false}
          />
          <Area
            type="linear"
            dataKey="value"
            stroke="var(--tt-accent)"
            strokeWidth={1}
            fill="url(#trendFill)"
            isAnimationActive={false}
            activeDot={false}
            dot={(props) => <CapturingDot {...props} onPosition={handlePosition} />}
          />
        </AreaChart>
      </ResponsiveContainer>

      {pinnedPos && (
        <div
          className="absolute z-10"
          style={{
            left: pinnedPos.x,
            top: pinnedPos.y,
            transform:
              activeLocalIndex === 0
                ? "translate(0%, calc(-100% - 10px))"
                : activeLocalIndex === chartData.length - 1
                ? "translate(-100%, calc(-100% - 10px))"
                : "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <div className="bg-white border border-[var(--tt-border)] rounded-lg shadow-md px-3 py-2 text-center">
            <div className="text-[12px] text-[var(--tt-text-secondary)]">
              {data[pinnedOriginalIndex].date}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full border-[1.5px] border-[var(--tt-accent)] bg-white shrink-0" />
              <Editable
                value={data[pinnedOriginalIndex].value}
                numeric
                onChange={(v) => onChangeY(pinnedOriginalIndex, v)}
                className="text-[15px] font-semibold text-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
