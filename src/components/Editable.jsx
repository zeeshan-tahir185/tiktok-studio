import { useEffect, useRef } from "react";

export default function Editable({
  value,
  onChange,
  className = "",
  style,
  as: Tag = "span",
  numeric = false,
}) {
  const ref = useRef(null);
  const focused = useRef(false);
  const latest = useRef({ value, onChange, numeric });
  latest.current = { value, onChange, numeric };

  const display = (v) => (v === null || v === undefined ? "-" : String(v));

  useEffect(() => {
    if (!ref.current) return;
    if (focused.current) return;
    if (ref.current.textContent !== display(value)) {
      ref.current.textContent = display(value);
    }
  }, [value]);

  // Native capture-phase listener: fires immediately on blur, before React's
  // synthetic event batching — this avoids losing the commit when the same
  // click also triggers an unmount (e.g. a hover-tracking tooltip closing).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const commit = () => {
      focused.current = false;
      const { value, onChange, numeric } = latest.current;
      const raw = el.textContent.trim();
      if (numeric) {
        const cleaned = raw.replace(/[^0-9.\-]/g, "");
        const num = parseFloat(cleaned);
        if (Number.isNaN(num)) {
          el.textContent = display(value);
          return;
        }
        onChange(num);
        el.textContent = String(num);
      } else {
        onChange(raw.length ? raw : display(value));
      }
    };

    el.addEventListener("blur", commit, true);
    return () => el.removeEventListener("blur", commit, true);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      ref.current.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => (focused.current = true)}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
    />
  );
}
