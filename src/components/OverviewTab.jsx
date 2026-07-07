import { useState } from "react";
import { useAnalyticsData } from "../data/DataContext";
import VideoInfoBar from "./VideoInfoBar";
import StatRow from "./StatRow";
import AreaTrendChart from "./AreaTrendChart";
import NoteBar from "./NoteBar";
import RetentionChart from "./RetentionChart";
import BarRow from "./BarRow";
import Card from "./Card";

function parseLeadingNumber(text) {
  const match = String(text).match(/-?[\d.,]+\s*([kKmM]?)/);
  if (!match) return null;
  const base = parseFloat(match[0].replace(/[^\d.-]/g, ""));
  if (Number.isNaN(base)) return null;
  const suffix = match[1].toLowerCase();
  const multiplier = suffix === "k" ? 1000 : suffix === "m" ? 1000000 : 1;
  return base * multiplier;
}

export default function OverviewTab() {
  const { data, updateField, updateListItem } = useAnalyticsData();
  const o = data.overview;
  const [activeKey, setActiveKey] = useState(o.metrics[0].key);

  const activeIndex = o.metrics.findIndex((m) => m.key === activeKey);
  const active = o.metrics[activeIndex];

  return (
    <div className="px-8 py-8 space-y-3 bg-[#FAF9FA]">
      <div className="rounded-lg border border-[var(--tt-border)] bg-white">
        <VideoInfoBar />
      </div>

      <div className="rounded-lg border border-[var(--tt-border)] bg-white overflow-hidden">
        <StatRow
          metrics={o.metrics}
          activeKey={activeKey}
          onSelect={setActiveKey}
          onChangeValue={(key, v) => {
            const i = o.metrics.findIndex((m) => m.key === key);
            updateField(["overview", "metrics", i, "value"], v);

            const numeric = parseLeadingNumber(v);
            const lastIndex = o.metrics[i].trend.length - 1;
            if (numeric !== null) {
              updateField(["overview", "metrics", i, "trend", lastIndex, "value"], numeric);
            }
          }}
        />
        <div className="px-3 pt-2">
          <AreaTrendChart
            data={active.trend}
            yAxisMax={active.yAxisMax}
            yTickFormatter={active.yTickFormatter}
            onChangeY={(pointIndex, v) =>
              updateField(
                ["overview", "metrics", activeIndex, "trend", pointIndex, "value"],
                v
              )
            }
            onChangeDate={(pointIndex, v) =>
              updateField(
                ["overview", "metrics", activeIndex, "trend", pointIndex, "date"],
                v
              )
            }
            onChangeYAxisMax={(v) =>
              updateField(["overview", "metrics", activeIndex, "yAxisMax"], v)
            }
          />
        </div>
        {/* <NoteBar
          value={o.chartNote}
          onChange={(v) => updateField(["overview", "chartNote"], v)}
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <Card title="Retention rate">
          <RetentionChart
            sentence={{ before: "Most viewers stopped watching at", after: ". Play the video below to see when they lost interest." }}
            peakTime={o.retention.peakTime}
            onChangePeakTime={(v) => updateField(["overview", "retention", "peakTime"], v)}
            duration={o.retention.duration}
            onChangeDuration={(v) => updateField(["overview", "retention", "duration"], v)}
            startTime={o.retention.startTime}
            onChangeStartTime={(v) => updateField(["overview", "retention", "startTime"], v)}
            yTopLabel={o.retention.yTopLabel}
            onChangeYTopLabel={(v) => updateField(["overview", "retention", "yTopLabel"], v)}
            yMidLabel={o.retention.yMidLabel}
            onChangeYMidLabel={(v) => updateField(["overview", "retention", "yMidLabel"], v)}
            data={o.retention.data}
            onChangeY={(i, v) => updateListItem(["overview", "retention", "data"], i, "pct", v)}
            thumbnailUrl={data.video.thumbnailUrl}
          />
        </Card>

        <div className="space-y-3">
          <Card title="Traffic source">
            {o.trafficSource.map((item, i) => (
              <BarRow
                key={i}
                label={item.label}
                pct={item.pct}
                onChangePct={(v) => updateListItem(["overview", "trafficSource"], i, "pct", v)}
                onChangeLabel={(v) => updateListItem(["overview", "trafficSource"], i, "label", v)}
              />
            ))}
          </Card>

          <Card title="Search queries">
            {o.searchQueries.map((item, i) => (
              <BarRow
                key={i}
                label={item.term}
                pct={item.pct}
                onChangePct={(v) => updateListItem(["overview", "searchQueries"], i, "pct", v)}
                onChangeLabel={(v) => updateListItem(["overview", "searchQueries"], i, "term", v)}
              />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
