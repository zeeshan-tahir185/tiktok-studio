import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import Editable from "./Editable";

const CHART_HEIGHT = 220;

function formatTick(v, kind) {
  if (v === 0) return "";
  switch (kind) {
    case "compact":
      return Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : `${v}`;
    case "hours":
      return `${v}h`;
    case "seconds":
      return `${v}s`;
    case "percent":
      return `${v}%`;
    default:
      return `${v}`;
  }
}

function CustomDot({ cx, cy, index, value, payload, selectedIndex, onSelect, onChangeY }) {
  if (cx == null || cy == null) return null;
  const isSelected = index === selectedIndex;
  const scalarValue = Array.isArray(value) ? value[1] : value;
  const boxX = Math.max(4, cx - 44);
  const boxY = Math.max(4, cy - 76);

  return (
    <g>
      {isSelected && (
        <line x1={cx} y1={0} x2={cx} y2={CHART_HEIGHT} stroke="#ccc" strokeDasharray="4 4" />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill="rgba(0,0,0,0.001)"
        style={{ cursor: "pointer", pointerEvents: "all" }}
        onClick={() => onSelect(index)}
      />
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#fff"
        stroke="var(--tt-accent)"
        strokeWidth={1.5}
        style={{ pointerEvents: "none" }}
      />
      {isSelected && (
        <foreignObject x={boxX} y={boxY} width={90} height={58}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="bg-white border border-[var(--tt-border)] rounded-lg shadow-md px-3 py-2"
          >
            <div className="text-[12px] text-[var(--tt-text-secondary)]">{payload.date}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--tt-accent)] shrink-0" />
              <Editable
                value={scalarValue}
                numeric
                onChange={(v) => onChangeY(index, v)}
                className="text-[15px] font-semibold text-black"
              />
            </div>
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default function AreaTrendChart({ data, onChangeY, yTickFormatter = "plain" }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
      <AreaChart data={data} margin={{ top: 26, right: 10, left: 8, bottom: 6 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--tt-accent)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--tt-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eef0f2" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--tt-text-secondary)" }}
          axisLine={{ stroke: "#eee" }}
          tickLine={false}
          padding={{ right: 20 }}
        />
        <YAxis
          orientation="right"
          tick={{ fontSize: 11, fill: "var(--tt-text-secondary)" }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={(v) => formatTick(v, yTickFormatter)}
        />
        <Area
          type="linear"
          dataKey="value"
          stroke="var(--tt-accent)"
          strokeWidth={1}
          fill="url(#trendFill)"
          isAnimationActive={false}
          dot={(props) => (
            <CustomDot
              {...props}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              onChangeY={onChangeY}
            />
          )}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
