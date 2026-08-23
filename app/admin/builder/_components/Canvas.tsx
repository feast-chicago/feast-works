"use client";

import { PageComponent } from "@/types/feast";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentItem from "./ComponentItem";

export default function Canvas({
  layout,
  onToggleVisible,
  onRemove,
}: {
  layout: PageComponent[];
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 min-h-96 bg-muted/30 rounded-xl border border-dashed">
      {layout.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Drag components here to build your page
        </div>
      ) : (
        <SortableContext
          items={layout.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {layout.map((component) => (
            <ComponentItem
              key={component.id}
              component={component}
              onToggleVisible={onToggleVisible}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>
      )}
    </div>
  );
}
