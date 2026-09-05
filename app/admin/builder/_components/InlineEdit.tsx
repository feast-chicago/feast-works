"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps any text element and makes it inline-editable on double-click.
 * Single click selects the component, double click enters edit mode.
 */
export function InlineEdit({
  value,
  onChange,
  placeholder = "Click to edit...",
  as: Tag = "p",
  className = "",
}: {
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  function handleBlur() {
    setEditing(false);
    if (ref.current) onChange(ref.current.innerText.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      ref.current?.blur();
    }
    // stop dnd-kit from intercepting keyboard events while editing
    e.stopPropagation();
  }

  return (
    <Tag
      ref={ref as any}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={(e) => {
        e.stopPropagation(); // don't bubble to block's onClick (settings)
        setEditing(true);
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`
        outline-none
        ${editing ? "ring-1 ring-primary rounded px-1 -mx-1 cursor-text" : "cursor-pointer"}
        ${!value ? "text-muted-foreground/50 italic" : ""}
        ${className}
      `}
      data-placeholder={!value && !editing ? placeholder : undefined}
    >
      {value || (editing ? "" : placeholder)}
    </Tag>
  );
}
