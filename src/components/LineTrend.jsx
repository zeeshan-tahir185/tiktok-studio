import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Editable from "./Editable";

function EditablePoint({ x, y, value, index, onChangeY }) {
  if (x == null || y == null) return null;
  return (
    <foreignObject x={x - 20} y={y - 26} width={40} height={20}>
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style={{ textAlign: "center" }}
      >
        <Editable
          value={value}
          numeric
          onChange={(v) => onChangeY(index, v)}
          className="inline-block text-[11px] text-[var(--tt-accent-dark)] font-medium px-0.5 rounded"
        />
      </div>
    </foreignObject>
  );
}

export default function LineTrend({
  data,
  xKey,
  yKey,
  onChangeY,
  height = 180,
  suffix = "",
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f1f2" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "var(--tt-text-secondary)" }}
          axisLine={{ stroke: "#eee" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--tt-text-secondary)" }}
          axisLine={false}
          tickLine={false}
          width={44}
          tickFormatter={(v) =>
            Math.abs(v) >= 1000
              ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`
              : `${v}`
          }
        />
        <Tooltip
          formatter={(v) => [`${v}${suffix}`, ""]}
          contentStyle={{ fontSize: 12, borderRadius: 8 }}
        />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke="var(--tt-accent)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--tt-accent)", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          isAnimationActive={false}
          label={(props) => (
            <EditablePoint {...props} onChangeY={onChangeY} />
          )}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
