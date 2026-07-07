import { PieChart, Pie, Cell } from "recharts";
import Editable from "./Editable";

const COLORS = ["rgba(0,117,219,1)", "rgba(0,117,219,0.8)", "rgba(0,117,219,0.6)"];

export default function GenderDonut({ male, female, other, onChange }) {
  const data = [
    { key: "malePct", label: "Male", value: male },
    { key: "femalePct", label: "Female", value: female },
    { key: "otherPct", label: "Other", value: other },
  ];

  return (
    <div className="flex items-center justify-between px-8 py-4">
      <PieChart width={190} height={110}>
        <Pie
          data={data}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          cx={95}
          cy={105}
          innerRadius={48}
          outerRadius={90}
          paddingAngle={2}
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((entry, i) => (
            <Cell key={entry.key} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>
      <div className="space-y-3">
        {data.map((entry, i) => (
          <div key={entry.key} className="flex items-center gap-2 text-[13px]">
            <span
              className="w-2.5 h-2.5 rounded-[2px] shrink-0"
              style={{ background: COLORS[i] }}
            />
            <span className="text-[var(--tt-text)] w-16">{entry.label}</span>
            <div className="flex items-center w-12 justify-end">
              <Editable
                value={entry.value}
                numeric
                onChange={(v) => onChange(entry.key, v)}
                className="font-semibold text-[var(--tt-text)]"
              />
              <span className="font-semibold text-[var(--tt-text)]">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
