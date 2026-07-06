import { PieChart, Pie, Cell } from "recharts";
import Editable from "./Editable";

const COLORS = ["#1477fc", "#7cb8fd", "#c7dffe"];

export default function GenderDonut({ male, female, other, onChange }) {
  const data = [
    { key: "malePct", label: "Male", value: male },
    { key: "femalePct", label: "Female", value: female },
    { key: "otherPct", label: "Other", value: other },
  ];

  return (
    <div className="flex items-center gap-6">
      <PieChart width={170} height={100}>
        <Pie
          data={data}
          dataKey="value"
          startAngle={180}
          endAngle={0}
          cx={85}
          cy={95}
          innerRadius={50}
          outerRadius={80}
          stroke="none"
          isAnimationActive={false}
        >
          {data.map((entry, i) => (
            <Cell key={entry.key} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>
      <div className="flex-1 space-y-2.5">
        {data.map((entry, i) => (
          <div key={entry.key} className="flex items-center gap-2 text-[13px]">
            <span
              className="w-2.5 h-2.5 rounded-[2px] shrink-0"
              style={{ background: COLORS[i] }}
            />
            <span className="text-[var(--tt-text)] flex-1">{entry.label}</span>
            <div className="flex items-center gap-0.5 w-12 justify-end">
              <Editable
                value={entry.value}
                numeric
                onChange={(v) => onChange(entry.key, v)}
                className="font-medium text-[var(--tt-text)]"
              />
              <span className="text-[var(--tt-text-secondary)]">%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
