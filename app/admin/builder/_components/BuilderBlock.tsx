"use client";

import { PageComponent } from "@/types/feast";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Settings2, Trash2 } from "lucide-react";
import { useRef } from "react";

export default function BuilderBlock({
  component,
  isSelected,
  onSelect,
  onToggleVisible,
  onRemove,
  children,
}: {
  component: PageComponent;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const blockRef = useRef<HTMLDivElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative
        ${isDragging ? "opacity-40 z-50" : "opacity-100"}
        ${!component.isVisible ? "opacity-50" : ""}
      `}
    >
      {/* selection / hover ring */}
      <div
        className={`
          absolute inset-0 rounded-md pointer-events-none z-10 transition-all
          ${
            isSelected
              ? "ring-2 ring-primary ring-offset-2"
              : "ring-1 ring-transparent group-hover:ring-border group-hover:ring-offset-1"
          }
        `}
      />

      {/* toolbar — shown on hover or when selected */}
      <div
        className={`
          absolute -top-8 left-0 z-20 flex items-center gap-0.5
          bg-background border border-border rounded-md shadow-sm px-1 py-0.5
          transition-opacity duration-100
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
      >
        {/* drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-1 text-muted-foreground hover:text-foreground cursor-grab rounded"
          aria-label="Drag to reorder"
        >
          <GripVertical className="size-3.5" />
        </button>

        <div className="w-px h-4 bg-border mx-0.5" />

        {/* component name */}
        <span className="text-xs text-muted-foreground px-1 capitalize select-none">
          {component.type.replace(/_/g, " ")}
        </span>

        <div className="w-px h-4 bg-border mx-0.5" />

        {/* settings — opens left panel */}
        <button
          onClick={() => onSelect(component.id)}
          className={`p-1 rounded transition-colors ${
            isSelected
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label="Edit settings"
        >
          <Settings2 className="size-3.5" />
        </button>

        {/* visibility */}
        <button
          onClick={() => onToggleVisible(component.id)}
          className="p-1 text-muted-foreground hover:text-foreground rounded"
          aria-label="Toggle visibility"
        >
          {component.isVisible ? (
            <Eye className="size-3.5" />
          ) : (
            <EyeOff className="size-3.5" />
          )}
        </button>

        {/* delete */}
        <button
          onClick={() => onRemove(component.id)}
          className="p-1 text-muted-foreground hover:text-destructive rounded"
          aria-label="Remove section"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {/* the actual rendered component */}
      <div
        ref={blockRef}
        onClick={() => onSelect(component.id)}
        className="cursor-pointer"
      >
        {children}
      </div>
    </div>
  );
}
