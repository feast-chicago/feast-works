"use client";

import { PageComponent } from "@/schema";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, EyeOff, GripVertical, Trash2 } from "lucide-react";
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
          absolute inset-0 rounded-none pointer-events-none z-10 transition-none
          ${
            isSelected
              ? "ring-2 ring-primary ring-offset-0"
              : "ring-1 ring-transparent group-hover:ring-border group-hover:ring-offset-0"
          }
        `}
      />

      {/* Component Toolbar */}
      <div
        className={`
          absolute -top-6 -left-6 z-20 flex flex-col items-center gap-0.5 border border-primary bg-primary rounded-none py-0.5 rounded-l-sm transition-opacity duration-100 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
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

        {/* Visibility */}
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

      {/* Component Label */}
      <div
        className={`
          absolute -top-6 h-6 z-20 flex flex-col justify-center items-center border border-primary bg-primary rounded-none pl-1.5 pr-3 rounded-tr-sm transition-opacity duration-100 ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"} text-xs text-primary-foreground font-bold capitalize select-none`}
      >
        {component.type.replace(/_/g, " ")} Block
      </div>

      {/* Rendered component */}
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
