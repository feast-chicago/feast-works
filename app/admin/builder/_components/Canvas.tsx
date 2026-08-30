"use client";

import { PageComponent } from "@/types/feast";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentItem from "./ComponentItem";

export default function Canvas({
  layout,
  selectedId,
  onSelect,
  onToggleVisible,
  onRemove,
}: {
  layout: PageComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex gap-4">
      {/* Fix issue 6 — vertical component list on left */}
      <div className="flex flex-col gap-2 p-4 min-h-96 flex-1 bg-muted/30 rounded-xl border border-dashed">
        {layout.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Add sections from the left panel to build your page
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
                isSelected={selectedId === component.id}
                onSelect={onSelect}
                onToggleVisible={onToggleVisible}
                onRemove={onRemove}
              />
            ))}
          </SortableContext>
        )}
      </div>

      {/* Fix issue 5 — preview panel on right */}
      <div className="w-64 shrink-0 rounded-xl border bg-card overflow-hidden hidden xl:block">
        <div className="p-3 border-b text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Preview
        </div>
        <div className="p-3 flex flex-col gap-2 overflow-y-auto max-h-[600px]">
          {layout
            .filter((c) => c.visible)
            .map((component) => (
              <ComponentPreview key={component.id} component={component} />
            ))}
        </div>
      </div>
    </div>
  );
}

// Lightweight preview — shows what each section looks like at a glance
function ComponentPreview({ component }: { component: PageComponent }) {
  const props = component.props as any;

  const previewMap: Record<string, React.ReactNode> = {
    rich_text: (
      <div className="p-3 rounded bg-muted/50 border border-border/50">
        {props?.heading && (
          <p className="text-xs font-medium truncate">{props.heading}</p>
        )}
        {props?.body && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {props.body}
          </p>
        )}
        {props?.button && (
          <div className="mt-1.5 inline-block text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded">
            {props.button.label}
          </div>
        )}
      </div>
    ),
    menu: (
      <div className="p-3 rounded bg-muted/50 border border-border/50">
        <p className="text-xs font-medium">{props?.heading ?? "Our Menu"}</p>
        <div className="mt-1 grid grid-cols-3 gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 rounded bg-muted" />
          ))}
        </div>
      </div>
    ),
    hours: (
      <div className="p-3 rounded bg-muted/50 border border-border/50">
        <p className="text-xs font-medium">{props?.heading ?? "Hours"}</p>
        <div className="mt-1 space-y-0.5">
          {["Mon–Fri", "Saturday", "Sunday"].map((d) => (
            <div
              key={d}
              className="flex justify-between text-[10px] text-muted-foreground"
            >
              <span>{d}</span>
              <span>9am – 5pm</span>
            </div>
          ))}
        </div>
      </div>
    ),
    gallery: (
      <div className="p-3 rounded bg-muted/50 border border-border/50">
        <p className="text-xs font-medium mb-1">
          {props?.heading ?? "Gallery"}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 rounded bg-muted" />
          ))}
        </div>
      </div>
    ),
    map: (
      <div className="p-3 rounded bg-muted/50 border border-border/50">
        <p className="text-xs font-medium mb-1">
          {props?.heading ?? "Find us"}
        </p>
        <div className="h-16 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
          Map
        </div>
      </div>
    ),
    testimonials: (
      <div className="p-3 rounded bg-muted/50 border border-border/50">
        <p className="text-xs font-medium mb-1">
          {props?.heading ?? "Testimonials"}
        </p>
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <div key={i} className="h-8 rounded bg-muted" />
          ))}
        </div>
      </div>
    ),
    divider: (
      <div className="py-2 flex items-center gap-2">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] text-muted-foreground">Divider</span>
        <div className="flex-1 h-px bg-border" />
      </div>
    ),
  };

  return (
    <div className="text-xs">
      {previewMap[component.type] ?? (
        <div className="p-3 rounded bg-muted/50 border border-border/50">
          <p className="text-xs font-medium capitalize">
            {component.type.replace(/_/g, " ")}
          </p>
        </div>
      )}
    </div>
  );
}
