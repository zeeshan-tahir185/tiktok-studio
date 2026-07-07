import { useState } from "react";
import { useAnalyticsData } from "../data/DataContext";
import VideoInfoBar from "./VideoInfoBar";
import StatRow from "./StatRow";
import AreaTrendChart from "./AreaTrendChart";
import NoteBar from "./NoteBar";
import RetentionChart from "./RetentionChart";
import BarRow from "./BarRow";
import Card from "./Card";

const EMPTY_NOTE = "tips_of_update_wait";

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
  const [searchQueriesEmpty, setSearchQueriesEmpty] = useState(false);

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
            yMax={active.yMax}
            yTickCount={active.yTickCount}
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
            onChangeYTick={(tickIndex, v) => {
              // Every tick is derived as (position/count) * yMax, so editing
              // any one of them just solves for the new yMax that would put
              // it exactly there — the rest re-space themselves automatically.
              const position = tickIndex + 1;
              const newYMax = (v * active.yTickCount) / position;
              updateField(["overview", "metrics", activeIndex, "yMax"], newYMax);
            }}
            onAddYTick={() => {
              updateField(
                ["overview", "metrics", activeIndex, "yTickCount"],
                active.yTickCount + 1
              );
            }}
            onRemoveYTick={() => {
              if (active.yTickCount <= 2) return;
              updateField(
                ["overview", "metrics", activeIndex, "yTickCount"],
                active.yTickCount - 1
              );
            }}
            onAddDate={() => {
              const lastPoint = active.trend[active.trend.length - 1];
              updateField(["overview", "metrics", activeIndex, "trend"], [
                ...active.trend,
                { date: "New", value: lastPoint?.value ?? 0 },
              ]);
            }}
            onRemoveDate={(pointIndex) => {
              if (active.trend.length <= 2) return;
              updateField(
                ["overview", "metrics", activeIndex, "trend"],
                active.trend.filter((_, i) => i !== pointIndex)
              );
            }}
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
            yMax={o.retention.yMax}
            yTickCount={o.retention.yTickCount}
            onChangeYTick={(tickIndex, v) => {
              const position = tickIndex + 1;
              const newYMax = (v * o.retention.yTickCount) / position;
              updateField(["overview", "retention", "yMax"], newYMax);
            }}
            onAddYTick={() =>
              updateField(["overview", "retention", "yTickCount"], o.retention.yTickCount + 1)
            }
            onRemoveYTick={() => {
              if (o.retention.yTickCount <= 1) return;
              updateField(["overview", "retention", "yTickCount"], o.retention.yTickCount - 1);
            }}
            data={o.retention.data}
            onChangeY={(i, v) => updateListItem(["overview", "retention", "data"], i, "pct", v)}
            thumbnailUrl={data.video.thumbnailUrl}
            extraTopLine
          />
        </Card>

        <div className="space-y-3">
          <Card title="Traffic source">
            <div className="relative group/list">
              {o.trafficSource.map((item, i) => (
                <BarRow
                  key={i}
                  label={item.label}
                  pct={item.pct}
                  onChangePct={(v) => updateListItem(["overview", "trafficSource"], i, "pct", v)}
                  onChangeLabel={(v) => updateListItem(["overview", "trafficSource"], i, "label", v)}
                  onRemove={
                    o.trafficSource.length > 1
                      ? () =>
                          updateField(
                            ["overview", "trafficSource"],
                            o.trafficSource.filter((_, idx) => idx !== i)
                          )
                      : undefined
                  }
                />
              ))}
              <div
                className="absolute -bottom-1 -right-4 group/addRow flex items-center justify-center"
                style={{ width: 26, height: 26 }}
              >
                <button
                  onClick={() =>
                    updateField(["overview", "trafficSource"], [
                      ...o.trafficSource,
                      { label: "New", pct: 0 },
                    ])
                  }
                  title="Add a source"
                  className="opacity-0 group-hover/addRow:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
                  style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
                >
                  +
                </button>
              </div>
            </div>
          </Card>

          <div className="relative">
            <Card title="Search queries">
              {searchQueriesEmpty ? (
                <div className="text-[13px] text-[var(--tt-text-secondary)]">{EMPTY_NOTE}</div>
              ) : (
                <div className="relative group/list">
                  {o.searchQueries.map((item, i) => (
                    <BarRow
                      key={i}
                      label={item.term}
                      pct={item.pct}
                      onChangePct={(v) => updateListItem(["overview", "searchQueries"], i, "pct", v)}
                      onChangeLabel={(v) => updateListItem(["overview", "searchQueries"], i, "term", v)}
                      onRemove={
                        o.searchQueries.length > 1
                          ? () =>
                              updateField(
                                ["overview", "searchQueries"],
                                o.searchQueries.filter((_, idx) => idx !== i)
                              )
                          : undefined
                      }
                    />
                  ))}
                  <div
                    className="absolute -bottom-1 -right-4 group/addRow flex items-center justify-center"
                    style={{ width: 26, height: 26 }}
                  >
                    <button
                      onClick={() =>
                        updateField(["overview", "searchQueries"], [
                          ...o.searchQueries,
                          { term: "New", pct: 0 },
                        ])
                      }
                      title="Add a query"
                      className="opacity-0 group-hover/addRow:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
                      style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </Card>

            <div
              className="absolute top-4 right-4 group/emptyToggle flex items-center justify-end"
              style={{ width: 40, height: 24 }}
            >
              <button
                onClick={() => setSearchQueriesEmpty((s) => !s)}
                title={
                  searchQueriesEmpty
                    ? "Showing new-video (empty) preview — click to restore sample data"
                    : "Preview the new-video (not-enough-data) empty state"
                }
                className="relative rounded-full opacity-0 group-hover/emptyToggle:opacity-100 transition-colors shrink-0"
                style={{ width: 30, height: 16, background: searchQueriesEmpty ? "var(--tt-accent)" : "#ccc" }}
              >
                <span
                  className="absolute rounded-full bg-white shadow-sm transition-transform"
                  style={{ width: 12, height: 12, top: 2, left: searchQueriesEmpty ? 16 : 2 }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
