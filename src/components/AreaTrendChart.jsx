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

// Captures the ACTUAL rendered cx/cy of each dot — this is the one source
// of truth for on-screen position, tied to the real data value (not the
// mouse), so the tooltip box anchors exactly above the point.
function CapturingDot({ cx, cy, index, onPosition }) {
  useEffect(() => {
    if (cx != null && cy != null) onPosition(index, { x: cx, y: cy });
  }, [cx, cy, index]);
  if (cx == null || cy == null) return null;
  return <circle cx={cx} cy={cy} r={3} fill="#fff" stroke="var(--tt-accent)" strokeWidth={1.5} />;
}

function EditableXTick({ x, y, payload, index, lastIndex, canRemove, onChangeDate, onRemoveDate }) {
  const width = 84;
  let boxX = x - width / 2;
  let align = "center";
  let justify = "center";
  if (index === 0) {
    boxX = x;
    align = "left";
    justify = "flex-start";
  } else if (index === lastIndex) {
    boxX = x - width;
    align = "right";
    justify = "flex-end";
  }
  return (
    <foreignObject x={Math.round(boxX)} y={Math.round(y - 9)} width={width} height={20}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="group"
        style={{ display: "flex", justifyContent: justify, alignItems: "center", gap: 3 }}
      >
        <div style={{ textAlign: align, whiteSpace: "nowrap" }}>
          <Editable
            value={payload.value}
            onChange={(v) => onChangeDate(index, v)}
            className="text-[11px] text-[var(--tt-text-secondary)] inline-block"
          />
        </div>
        {canRemove && (
          <button
            onClick={() => onRemoveDate(index)}
            className="opacity-0 group-hover:opacity-100 text-[10px] leading-none text-[var(--tt-text-secondary)] hover:text-red-500 shrink-0"
            style={{ width: 10, height: 10 }}
            title="Remove this date"
          >
            ×
          </button>
        )}
      </div>
    </foreignObject>
  );
}

// index 0 is always the fixed, non-editable "0" baseline tick (hidden,
// matches the reference design). Indices 1..N map 1:1 to yTicks[0..N-1] —
// what's displayed IS the real value used to position that gridline, so
// there's no proportional math left to ever drift out of sync.
function EditableYTick({ x, y, index, yTicks, yTickFormatter, canRemove, onChangeYTick, onRemoveYTick }) {
  if (index === 0) return null;
  const tickIndex = index - 1;
  const value = yTicks[tickIndex];
  const display = formatTick(value, yTickFormatter);
  return (
    <foreignObject x={Math.round(x)} y={Math.round(y - 8)} width={62} height={16}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        className="group"
        style={{ display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap", lineHeight: "16px" }}
      >
        <Editable
          value={display}
          onChange={(text) => {
            const parsed = parseAxisValue(text, yTickFormatter);
            if (parsed !== null && parsed > 0) onChangeYTick(tickIndex, parsed);
          }}
          className="text-[11px] text-[var(--tt-text-secondary)] inline-block"
        />
        {canRemove && (
          <button
            onClick={() => onRemoveYTick(tickIndex)}
            className="opacity-0 group-hover:opacity-100 text-[10px] leading-none text-[var(--tt-text-secondary)] hover:text-red-500 shrink-0"
            style={{ width: 10, height: 10 }}
            title="Remove this value"
          >
            ×
          </button>
        )}
      </div>
    </foreignObject>
  );
}

export default function AreaTrendChart({
  data,
  onChangeY,
  onChangeDate,
  onAddDate,
  onRemoveDate,
  yMax,
  yTickCount,
  onChangeYTick,
  onAddYTick,
  onRemoveYTick,
  yTickFormatter = "plain",
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const [positions, setPositions] = useState({});

  // The chart plots exactly the points in `data` — however many the user
  // has added/removed — so nodes always match the visible date count 1:1.
  const chartData = data;

  // The Y axis always divides [0, yMax] into `yTickCount` EQUAL steps —
  // exactly mirroring how the X axis's categorical layout auto-spaces
  // whatever dates exist evenly. Deriving every tick from a single step
  // means add/remove can never leave an uneven gap (the old bug: dropping
  // just one raw value out of an arbitrary array left a lopsided space
  // where it used to be). The domain is driven ONLY by yMax (not the data
  // values), so removing a division actually shrinks the visible scale.
  const step = yMax / yTickCount;
  const yTicks = Array.from({ length: yTickCount }, (_, i) => (i + 1) * step);
  const domainMax = Math.max(yMax, 1);
  const allTicks = [0, ...yTicks];

  const handlePosition = (index, pos) => {
    setPositions((prev) => {
      const existing = prev[index];
      if (existing && existing.x === pos.x && existing.y === pos.y) return prev;
      return { ...prev, [index]: pos };
    });
  };

  const pinnedPos = activeIndex != null ? positions[activeIndex] : null;

  return (
    <div className="relative group/chart" onMouseLeave={() => setActiveIndex(null)}>
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
            stroke="var(--tt-border)"
          />
          <XAxis
            dataKey="date"
            interval={0}
            tick={(props) => (
              <EditableXTick
                {...props}
                lastIndex={chartData.length - 1}
                canRemove={chartData.length > 2}
                onChangeDate={onChangeDate}
                onRemoveDate={onRemoveDate}
              />
            )}
            axisLine={{ stroke: "#eee" }}
            tickLine={false}
            tickMargin={2}
            padding={{ right: 0 }}
          />
          <YAxis
            orientation="right"
            domain={[0, domainMax]}
            ticks={allTicks}
            interval={0}
            axisLine={false}
            tickLine={false}
            width={62}
            tick={(props) => (
              <EditableYTick
                {...props}
                yTicks={yTicks}
                yTickFormatter={yTickFormatter}
                canRemove={yTicks.length > 2}
                onChangeYTick={onChangeYTick}
                onRemoveYTick={onRemoveYTick}
              />
            )}
          />
          <Tooltip
            content={(props) => (
              <TooltipCapture {...props} chartData={chartData} onActive={setActiveIndex} />
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

      <div
        className="absolute bottom-0 right-8 group/addDate flex items-center justify-center"
        style={{ width: 26, height: 26 }}
      >
        <button
          onClick={onAddDate}
          title="Add a date"
          className="opacity-0 group-hover/addDate:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
          style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
        >
          +
        </button>
      </div>

      <div
        className="absolute top-0 right-0 group/addYTick flex items-center justify-center"
        style={{ width: 26, height: 26 }}
      >
        <button
          onClick={onAddYTick}
          title="Add a value"
          className="opacity-0 group-hover/addYTick:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
          style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
        >
          +
        </button>
      </div>

      {pinnedPos && (
        <div
          className="absolute z-10"
          style={{
            left: pinnedPos.x,
            top: pinnedPos.y,
            transition: "left 0.15s ease-out, top 0.15s ease-out",
            transform:
              activeIndex === 0
                ? "translate(0%, calc(-100% - 10px))"
                : activeIndex === chartData.length - 1
                ? "translate(-100%, calc(-100% - 10px))"
                : "translate(-50%, calc(-100% - 10px))",
          }}
        >
          <div className="bg-white border border-[var(--tt-border)] rounded-sm shadow-md px-3 py-2 text-center">
            <div className="text-[13px] text-[var(--tt-text-secondary)]">
              {data[activeIndex].date}
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-0.5">
              <span className="w-[7px] h-[7px] rounded-full border-[1.5px] border-[var(--tt-accent)] bg-white shrink-0" />
              <Editable
                value={formatTick(data[activeIndex].value, yTickFormatter)}
                onChange={(text) => {
                  const parsed = parseAxisValue(text, yTickFormatter);
                  if (parsed !== null) onChangeY(activeIndex, parsed);
                }}
                className="text-[15px] font-semibold text-black"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
