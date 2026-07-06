import { useState } from "react";
import { AreaChart, Area, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Editable from "./Editable";
import VideoPlayPreview from "./VideoPlayPreview";

const CHART_HEIGHT = 50;
const CHART_MARGIN_TOP = 6;

function CustomDot({ cx, cy, index, value, selectedIndex, onSelect, onChangeY }) {
  if (cx == null || cy == null) return null;
  const isSelected = index === selectedIndex;
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="transparent"
        style={{ cursor: "pointer" }}
        onClick={() => onSelect(index)}
      />
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={2.5}
          fill="#fff"
          stroke="var(--tt-accent)"
          strokeWidth={1.25}
        />
      )}
      {isSelected && (
        <foreignObject x={Math.max(0, cx - 20)} y={cy - 28} width={40} height={20}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ textAlign: "center" }}>
            <Editable
              value={value}
              numeric
              onChange={(v) => onChangeY(index, v)}
              className="inline-block text-[10px] bg-white border border-[var(--tt-border)] rounded px-1 shadow-sm text-[var(--tt-accent-dark)] font-medium"
            />
          </div>
        </foreignObject>
      )}
    </g>
  );
}

export default function RetentionChart({
  sentence,
  peakTime,
  onChangePeakTime,
  duration,
  data,
  onChangeY,
  thumbnailUrl,
}) {
  const firstPct = data[0]?.pct ?? 0;
  const [scrub, setScrub] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

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

      <div className="relative mt-4">
        <div
          className="absolute left-0 right-9 border-t border-dashed border-[#e5e6e9]"
          style={{ top: CHART_MARGIN_TOP }}
        />
        <div
          className="absolute left-0 right-9 border-t border-dashed border-[#e5e6e9]"
          style={{ top: CHART_MARGIN_TOP + (CHART_HEIGHT - CHART_MARGIN_TOP) / 2 }}
        />
        <div
          className="absolute right-0 text-[11px] text-[var(--tt-text-secondary)] -translate-y-1/2"
          style={{ top: CHART_MARGIN_TOP }}
        >
          100%
        </div>
        <div
          className="absolute right-0 text-[11px] text-[var(--tt-text-secondary)] -translate-y-1/2"
          style={{ top: CHART_MARGIN_TOP + (CHART_HEIGHT - CHART_MARGIN_TOP) / 2 }}
        >
          50%
        </div>
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <AreaChart data={data} margin={{ top: CHART_MARGIN_TOP, right: 34, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="retentionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--tt-accent)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--tt-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{ fontSize: 11, borderRadius: 8 }}
              cursor={{ stroke: "#ccc", strokeDasharray: "4 4" }}
            />
            <Area
              type="linear"
              dataKey="pct"
              stroke="var(--tt-accent)"
              strokeWidth={1}
              fill="url(#retentionFill)"
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
        <span>0:00 ({firstPct}%)</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}
