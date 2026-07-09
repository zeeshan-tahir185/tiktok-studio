import { useAnalyticsData } from "../data/DataContext";
import BarRow from "./BarRow";
import DualBar from "./DualBar";
import GenderDonut from "./GenderDonut";
import Editable from "./Editable";
import Card from "./Card";

const EMPTY_NOTE = "tips_of_update_wait";

export default function ViewersTab() {
  const {
    data,
    updateField,
    updateListItem,
    viewersPreviewEmpty: previewEmpty,
    setViewersPreviewEmpty: setPreviewEmpty,
  } = useAnalyticsData();
  const v = data.viewers;

  return (
    <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-3">
      <div className="space-y-3">
        <div className="relative">
          <Card title="Total viewers" divider={false}>
            {previewEmpty ? (
              <>
                <div className="text-[13px] text-[var(--tt-text-secondary)]">{EMPTY_NOTE}</div>
                <div className="text-[30px] font-semibold text-[var(--tt-text)] leading-none block mt-2.5">
                  --
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </Card>

          <div
            className="absolute top-4 right-4 group/emptyToggle flex items-center justify-end"
            style={{ width: 40, height: 24 }}
          >
            <button
              onClick={() => setPreviewEmpty((s) => !s)}
              title={
                previewEmpty
                  ? "Showing new-video (empty) preview — click to restore sample data"
                  : "Preview the new-video (not-enough-data) empty state"
              }
              className="relative rounded-full opacity-0 group-hover/emptyToggle:opacity-100 transition-colors shrink-0"
              style={{ width: 30, height: 16, background: previewEmpty ? "var(--tt-accent)" : "#ccc" }}
            >
              <span
                className="absolute rounded-full bg-white shadow-sm transition-transform"
                style={{ width: 12, height: 12, top: 2, left: previewEmpty ? 16 : 2 }}
              />
            </button>
          </div>
        </div>

        <Card title="Viewer types">
          {previewEmpty && (
            <div className="text-[13px] text-[var(--tt-text-secondary)] mb-2">{EMPTY_NOTE}</div>
          )}
          <DualBar
            leftPct={v.viewerTypes.leftPct}
            leftLabel={previewEmpty ? v.viewerTypes.rightLabel : v.viewerTypes.leftLabel}
            rightLabel={previewEmpty ? v.viewerTypes.leftLabel : v.viewerTypes.rightLabel}
            onChangeLeftPct={(val) => updateField(["viewers", "viewerTypes", "leftPct"], val)}
            empty={previewEmpty}
          />
          <DualBar
            leftPct={v.followerTypes.leftPct}
            leftLabel={previewEmpty ? v.followerTypes.rightLabel : v.followerTypes.leftLabel}
            rightLabel={previewEmpty ? v.followerTypes.leftLabel : v.followerTypes.rightLabel}
            onChangeLeftPct={(val) => updateField(["viewers", "followerTypes", "leftPct"], val)}
            empty={previewEmpty}
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
          <div className="relative group/list">
            {v.locations.map((item, i) => (
              <BarRow
                key={i}
                label={item.country}
                pct={item.pct}
                onChangePct={(val) => updateListItem(["viewers", "locations"], i, "pct", val)}
                onChangeLabel={(val) => updateListItem(["viewers", "locations"], i, "country", val)}
                onRemove={
                  v.locations.length > 1
                    ? () =>
                        updateField(
                          ["viewers", "locations"],
                          v.locations.filter((_, idx) => idx !== i)
                        )
                    : undefined
                }
                allowStates
                states={item.states}
                onAddStatesFeature={() =>
                  updateField(["viewers", "locations", i, "states"], [{ label: "New", pct: 0 }])
                }
                onRemoveStatesFeature={() =>
                  updateField(["viewers", "locations", i, "states"], undefined)
                }
                onAddState={() =>
                  updateField(
                    ["viewers", "locations", i, "states"],
                    [...(item.states || []), { label: "New", pct: 0 }]
                  )
                }
                onRemoveState={(si) => {
                  if ((item.states || []).length <= 1) return;
                  updateField(
                    ["viewers", "locations", i, "states"],
                    item.states.filter((_, idx) => idx !== si)
                  );
                }}
                onChangeStateLabel={(si, v2) =>
                  updateField(
                    ["viewers", "locations", i, "states"],
                    item.states.map((s, idx) => (idx === si ? { ...s, label: v2 } : s))
                  )
                }
                onChangeStatePct={(si, v2) =>
                  updateField(
                    ["viewers", "locations", i, "states"],
                    item.states.map((s, idx) => (idx === si ? { ...s, pct: v2 } : s))
                  )
                }
              />
            ))}
            <div
              className="absolute -bottom-1 -right-4 group/addRow flex items-center justify-center"
              style={{ width: 26, height: 26 }}
            >
              <button
                onClick={() =>
                  updateField(["viewers", "locations"], [
                    ...v.locations,
                    { country: "New", pct: 0 },
                  ])
                }
                title="Add a location"
                className="opacity-0 group-hover/addRow:opacity-100 flex items-center justify-center rounded-full bg-white border border-[var(--tt-border)] text-[var(--tt-text-secondary)] hover:text-[var(--tt-accent)] hover:border-[var(--tt-accent)] shadow-sm"
                style={{ width: 18, height: 18, fontSize: 12, lineHeight: 1 }}
              >
                +
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
