import Editable from "./Editable";

export default function NoteBar({ value, onChange }) {
  return (
    <div className="mx-5 mb-5 rounded-lg bg-[var(--tt-note-bg)] px-4 py-2.5">
      <Editable
        value={value}
        onChange={onChange}
        className="text-[13px] text-[var(--tt-text-secondary)] text-left block"
      />
    </div>
  );
}
