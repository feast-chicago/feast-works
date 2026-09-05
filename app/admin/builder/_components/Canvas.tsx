"use client";

import { PageComponent } from "@/types/feast";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { BLOCK_MAP } from "./Blocks";
import BuilderBlock from "./BuilderBlock";

export default function Canvas({
  layout,
  selectedId,
  onSelect,
  onToggleVisible,
  onRemove,
  onPropsChange,
}: {
  layout: PageComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
  onPropsChange: (id: string, newProps: Record<string, unknown>) => void;
}) {
  return (
    <div className="flex flex-col gap-3 p-6 min-h-96 bg-muted/20 rounded-xl border border-dashed border-border/60">
      {layout.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20 text-center">
          <p className="text-sm text-muted-foreground">
            Add sections from the left panel
          </p>
          <p className="text-xs text-muted-foreground/60">
            Drag to reorder · Double-click text to edit inline
          </p>
        </div>
      ) : (
        <SortableContext
          items={layout.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {layout.map((component) => {
            const Block = BLOCK_MAP[component.type];

            return (
              <BuilderBlock
                key={component.id}
                component={component}
                isSelected={selectedId === component.id}
                onSelect={onSelect}
                onToggleVisible={onToggleVisible}
                onRemove={onRemove}
              >
                {Block ? (
                  <Block
                    props={component.props}
                    onChange={(newProps) =>
                      onPropsChange(component.id, newProps)
                    }
                  />
                ) : (
                  // fallback for component types without a block yet
                  <div className="px-8 py-10 bg-muted/30 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-muted-foreground capitalize">
                      {component.type.replace(/_/g, " ")} section
                    </p>
                  </div>
                )}
              </BuilderBlock>
            );
          })}
        </SortableContext>
      )}
    </div>
  );
}
