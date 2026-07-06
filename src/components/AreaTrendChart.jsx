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

function pickTicks(data) {
  if (data.length <= 3) return data.map((d) => d.date);
  const mid = Math.floor((data.length - 1) / 2);
  return [data[0].date, data[mid].date, data[data.length - 1].date];
}

function ChartTooltip({ active, payload, label, data, onChangeY }) {
  if (!active || !payload || !payload.length) return null;
  const index = data.findIndex((d) => d.date === label);
  const raw = payload[0].value;
  const value = Array.isArray(raw) ? raw[1] : raw;
  return (
    <div className="bg-white border border-[var(--tt-border)] rounded-lg shadow-md px-3 py-2">
      <div className="text-[12px] text-[var(--tt-text-secondary)]">{label}</div>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--tt-accent)] shrink-0" />
        <Editable
          value={value}
          numeric
          onChange={(v) => onChangeY(index, v)}
          className="text-[15px] font-semibold text-black"
        />
      </div>
    </div>
  );
}

export default function AreaTrendChart({ data, onChangeY, yTickFormatter = "plain" }) {
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
          ticks={pickTicks(data)}
          interval={0}
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
          content={(props) => <ChartTooltip {...props} data={data} onChangeY={onChangeY} />}
          cursor={{ stroke: "#ccc", strokeDasharray: "4 4" }}
          isAnimationActive={false}
          position={{ y: 6 }}
          wrapperStyle={{ pointerEvents: "auto", zIndex: 10 }}
        />
        <Area
          type="linear"
          dataKey="value"
          stroke="var(--tt-accent)"
          strokeWidth={1}
          fill="url(#trendFill)"
          isAnimationActive={false}
          dot={{ r: 3, fill: "#fff", stroke: "var(--tt-accent)", strokeWidth: 1.5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
