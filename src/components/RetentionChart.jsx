import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import Editable from "./Editable";
import VideoPlayPreview from "./VideoPlayPreview";

function EditablePoint({ x, y, value, index, onChangeY }) {
  if (x == null || y == null) return null;
  const boxX = Math.max(0, x - 18);
  return (
    <foreignObject x={boxX} y={y - 22} width={36} height={18}>
      <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: "center" }}>
        <Editable
          value={value}
          numeric
          onChange={(v) => onChangeY(index, v)}
          className="inline-block text-[10px] text-[var(--tt-accent-dark)] font-medium px-0.5 rounded"
        />
      </div>
    </foreignObject>
  );
}

export default function RetentionChart({
  sentence,
  peakTime,
  onChangePeakTime,
  duration,
  data,
  onChangeY,
}) {
  const firstPct = data[0]?.pct ?? 0;

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

      <VideoPlayPreview />

      <div className="relative mt-4">
        <div className="absolute right-0 top-0 text-[11px] text-[var(--tt-text-secondary)]">
          100%
        </div>
        <div className="absolute right-0 top-1/2 text-[11px] text-[var(--tt-text-secondary)]">
          50%
        </div>
        <ResponsiveContainer width="100%" height={95}>
          <AreaChart data={data} margin={{ top: 14, right: 34, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tt-accent)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--tt-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="pct"
              stroke="var(--tt-accent)"
              strokeWidth={1.5}
              fill="url(#retentionFill)"
              isAnimationActive={false}
              dot={false}
              label={(props) => <EditablePoint {...props} onChangeY={onChangeY} />}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="h-4 flex items-center">
        <div className="flex-1 h-px bg-[var(--tt-border)] relative">
          <div className="absolute -top-[7px] left-0 w-3.5 h-3.5 rounded-full bg-white border border-[var(--tt-border)] shadow-sm" />
        </div>
      </div>

      <div className="flex items-center justify-between text-[12px] text-[var(--tt-text-secondary)]">
        <span>0:00 ({firstPct}%)</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}
