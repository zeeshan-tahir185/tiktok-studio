import { useState } from "react";
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

function CustomDot({ cx, cy, index, value, selectedIndex, onSelect, onChangeY }) {
  if (cx == null || cy == null) return null;
  const isSelected = index === selectedIndex;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill="#fff"
        stroke="var(--tt-accent)"
        strokeWidth={1.5}
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(index)}
      />
      {isSelected && (
        <foreignObject x={Math.max(0, cx - 24)} y={cy - 32} width={48} height={22}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: "center" }}>
            <Editable
              value={value}
              numeric
              onChange={(v) => onChangeY(index, v)}
              className="inline-block text-[11px] bg-white border border-[var(--tt-border)] rounded px-1 shadow-sm text-[var(--tt-accent-dark)] font-medium"
            />
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default function AreaTrendChart({ data, onChangeY, yTickFormatter = "plain" }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <ResponsiveContainer width="100%" height={220}>
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
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
          cursor={{ stroke: "#ccc", strokeDasharray: "4 4" }}
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
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
