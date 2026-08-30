"use client";

import { PageComponent } from "@/types/feast";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Settings2, Trash2 } from "lucide-react";

export default function ComponentItem({
  component,
  isSelected,
  onSelect,
  onToggleVisible,
  onRemove,
}: {
  component: PageComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
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
      className={`flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors
        ${isSelected ? "border-primary ring-1 ring-primary" : component.visible ? "border-border" : "border-dashed border-muted-foreground opacity-60"}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      <span className="flex-1 text-sm font-medium capitalize">
        {component.type.replace(/_/g, " ")}
      </span>

      {/* Settings — opens props panel */}
      <button
        onClick={() => onSelect(component.id)}
        className={`transition-colors ${isSelected ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
        aria-label="Edit settings"
      >
        <Settings2 className="size-4" />
      </button>

      <button
        onClick={() => onToggleVisible(component.id)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Toggle visibility"
      >
        {component.visible ? (
          <Eye className="size-4" />
        ) : (
          <EyeOff className="size-4" />
        )}
      </button>

      <button
        onClick={() => onRemove(component.id)}
        className="text-muted-foreground hover:text-destructive"
        aria-label="Remove section"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
