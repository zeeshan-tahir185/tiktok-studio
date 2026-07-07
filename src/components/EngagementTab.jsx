import { useAnalyticsData } from "../data/DataContext";
import BarRow from "./BarRow";
import RetentionChart from "./RetentionChart";
import Editable from "./Editable";
import Card from "./Card";

export default function EngagementTab() {
  const { data, updateField, updateListItem } = useAnalyticsData();
  const e = data.engagement;

  return (
    <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-3 items-start">
      <Card title="Likes">
        <RetentionChart
          sentence={{ before: "Most viewers liked this video at", after: ". Play the video below to see when they liked it." }}
          peakTime={e.likes.peakTime}
          onChangePeakTime={(v) => updateField(["engagement", "likes", "peakTime"], v)}
          duration={e.likes.duration}
          onChangeDuration={(v) => updateField(["engagement", "likes", "duration"], v)}
          startTime={e.likes.startTime}
          onChangeStartTime={(v) => updateField(["engagement", "likes", "startTime"], v)}
          yMax={e.likes.yMax}
          yTickCount={e.likes.yTickCount}
          onChangeYTick={(tickIndex, v) => {
            const position = tickIndex + 1;
            const newYMax = (v * e.likes.yTickCount) / position;
            updateField(["engagement", "likes", "yMax"], newYMax);
          }}
          onAddYTick={() =>
            updateField(["engagement", "likes", "yTickCount"], e.likes.yTickCount + 1)
          }
          onRemoveYTick={() => {
            if (e.likes.yTickCount <= 1) return;
            updateField(["engagement", "likes", "yTickCount"], e.likes.yTickCount - 1);
          }}
          data={e.likes.data}
          onChangeY={(i, v) => updateListItem(["engagement", "likes", "data"], i, "pct", v)}
          thumbnailUrl={data.video.thumbnailUrl}
        />
      </Card>

      <Card title="Top words used in comments">
        <Editable
          value={e.emptyWordsNote}
          onChange={(v) => updateField(["engagement", "emptyWordsNote"], v)}
          className="text-[13px] text-[var(--tt-text-secondary)] block mb-4"
        />
        {e.topWords.map((item, i) => (
          <BarRow
            key={i}
            label={item.word}
            pct={item.pct}
            onChangePct={(v) => updateListItem(["engagement", "topWords"], i, "pct", v)}
            onChangeLabel={(v) => updateListItem(["engagement", "topWords"], i, "word", v)}
          />
        ))}
      </Card>
    </div>
  );
}
