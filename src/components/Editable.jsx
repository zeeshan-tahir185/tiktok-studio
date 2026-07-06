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

  const display = (v) => (v === null || v === undefined ? "-" : String(v));

  useEffect(() => {
    if (!ref.current) return;
    if (focused.current) return;
    if (ref.current.textContent !== display(value)) {
      ref.current.textContent = display(value);
    }
  }, [value]);

  const handleBlur = () => {
    focused.current = false;
    const raw = ref.current.textContent.trim();
    if (numeric) {
      const cleaned = raw.replace(/[^0-9.\-]/g, "");
      const num = parseFloat(cleaned);
      if (Number.isNaN(num)) {
        ref.current.textContent = display(value);
        return;
      }
      onChange(num);
      ref.current.textContent = String(num);
    } else {
      onChange(raw.length ? raw : display(value));
    }
  };

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
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
      style={style}
    />
  );
}
