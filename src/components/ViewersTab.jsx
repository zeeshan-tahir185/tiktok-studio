import { useAnalyticsData } from "../data/DataContext";
import BarRow from "./BarRow";
import DualBar from "./DualBar";
import GenderDonut from "./GenderDonut";
import Editable from "./Editable";
import Card from "./Card";

export default function ViewersTab() {
  const { data, updateField, updateListItem } = useAnalyticsData();
  const v = data.viewers;

  return (
    <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="space-y-3">
        <Card title="Total viewers" divider={false}>
          <Editable
            value={v.total.value}
            onChange={(val) => updateField(["viewers", "total", "value"], val)}
            className="text-[30px] font-semibold text-[var(--tt-text)] leading-none block"
          />
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="w-4 h-4 rounded-full bg-[var(--tt-accent)] flex items-center justify-center shrink-0">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V5M6 11l6-6 6 6"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <Editable
              value={v.total.changeValue}
              onChange={(val) => updateField(["viewers", "total", "changeValue"], val)}
              className="text-[13px] font-medium text-[var(--tt-accent)]"
            />
            <Editable
              value={v.total.changeLabel}
              onChange={(val) => updateField(["viewers", "total", "changeLabel"], val)}
              className="text-[13px] text-[var(--tt-text-secondary)]"
            />
          </div>
        </Card>

        <Card title="Viewer types">
          <DualBar
            leftPct={v.viewerTypes.leftPct}
            leftLabel={v.viewerTypes.leftLabel}
            rightLabel={v.viewerTypes.rightLabel}
            onChangeLeftPct={(val) => updateField(["viewers", "viewerTypes", "leftPct"], val)}
          />
          <DualBar
            leftPct={v.followerTypes.leftPct}
            leftLabel={v.followerTypes.leftLabel}
            rightLabel={v.followerTypes.rightLabel}
            onChangeLeftPct={(val) => updateField(["viewers", "followerTypes", "leftPct"], val)}
          />
        </Card>

        <Card title="Age">
          {v.age.map((item, i) => (
            <BarRow
              key={item.label}
              label={item.label}
              pct={item.pct}
              onChangePct={(val) => updateListItem(["viewers", "age"], i, "pct", val)}
            />
          ))}
        </Card>
      </div>

      <div className="space-y-3">
        <Card title="Gender">
          <GenderDonut
            male={v.gender.malePct}
            female={v.gender.femalePct}
            other={v.gender.otherPct}
            onChange={(key, val) => updateField(["viewers", "gender", key], val)}
          />
        </Card>

        <Card title="Locations">
          {v.locations.map((item, i) => (
            <BarRow
              key={i}
              label={item.country}
              pct={item.pct}
              chevron={item.expandable}
              onChangePct={(val) => updateListItem(["viewers", "locations"], i, "pct", val)}
              onChangeLabel={(val) => updateListItem(["viewers", "locations"], i, "country", val)}
            />
          ))}
        </Card>
      </div>
    </div>
  );
}
