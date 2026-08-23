"use client";

import { PageComponent } from "@/types/feast";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";

export default function ComponentItem({
  component,
  onToggleVisible,
  onRemove,
}: {
  component: PageComponent;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-lg border bg-card
        ${component.visible ? "border-border" : "border-dashed border-muted-foreground opacity-60"}`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="size-4" />
      </button>

      {/* Component name */}
      <span className="flex-1 text-sm font-medium capitalize">
        {component.type.replace(/-/g, " ")}
      </span>

      {/* Visibility toggle */}
      <button
        onClick={() => onToggleVisible(component.id)}
        className="text-muted-foreground hover:text-foreground"
      >
        {component.visible ? (
          <Eye className="size-4" />
        ) : (
          <EyeOff className="size-4" />
        )}
      </button>

      {/* Remove button */}
      <button
        onClick={() => onRemove(component.id)}
        className="text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
