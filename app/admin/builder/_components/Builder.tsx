"use client";

import { updateLayout } from "@/actions/layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DEFAULT_PROPS,
  PAGE_KEYS,
  PageComponent,
  PageKey,
  SiteLayout,
} from "@/types/feast";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Save } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { BLOCK_MAP } from "./Blocks";
import Canvas from "./Canvas";
import Palette from "./Palette";
import PropsPanel from "./PropsPanel";

export default function Builder({
  initialLayout,
  businessId,
}: {
  initialLayout: SiteLayout;
  businessId: string;
}) {
  const [layout, setLayout] = useState<SiteLayout>(initialLayout);
  const [activePage, setActivePage] = useState<PageKey>("home");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // track what's being dragged so DragOverlay knows what to render
  const [draggingType, setDraggingType] = useState<{
    source: "palette" | "canvas";
    type: PageComponent["type"];
  } | null>(null);

  const pageLayout = layout[activePage];
  const selected = pageLayout.find((c) => c.id === selectedId) ?? null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function updatePage(
    page: PageKey,
    updater: (prev: PageComponent[]) => PageComponent[],
  ) {
    setLayout((prev) => ({ ...prev, [page]: updater(prev[page]) }));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const data = active.data.current;

    if (data?.source === "palette") {
      setDraggingType({ source: "palette", type: data.type });
    } else {
      // dragging an existing canvas item
      const component = pageLayout.find((c) => c.id === active.id);
      if (component) {
        setDraggingType({ source: "canvas", type: component.type });
      }
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setDraggingType(null);
    const { active, over } = event;
    const activeData = active.data.current;

    // ── palette → canvas drop ────────────────────────────────────────
    if (activeData?.source === "palette") {
      // only insert if dropped on the canvas drop zone or an existing component
      if (!over) return;

      const type = activeData.type as PageComponent["type"];
      const newComponent: PageComponent = {
        id: `${type}-${Date.now()}`,
        type,
        isVisible: true,
        props: DEFAULT_PROPS[type] as any,
      };

      updatePage(activePage, (prev) => {
        // if dropped on an existing component, insert before it
        const overIndex = prev.findIndex((c) => c.id === over.id);
        if (overIndex !== -1) {
          const next = [...prev];
          next.splice(overIndex, 0, newComponent);
          return next;
        }
        // otherwise append to end
        return [...prev, newComponent];
      });

      setSelectedId(newComponent.id);
      return;
    }

    // ── canvas reorder ───────────────────────────────────────────────
    if (!over || active.id === over.id) return;
    updatePage(activePage, (prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function handleAdd(type: PageComponent["type"]) {
    const newComponent: PageComponent = {
      id: `${type}-${Date.now()}`,
      type,
      isVisible: true,
      props: DEFAULT_PROPS[type] as any,
    };
    updatePage(activePage, (prev) => [...prev, newComponent]);
    setSelectedId(newComponent.id);
  }

  function handlePropsChange(id: string, newProps: Record<string, unknown>) {
    updatePage(activePage, (prev) =>
      prev.map((c) => (c.id === id ? { ...c, props: newProps } : c)),
    );
  }

  function handleToggleVisible(id: string) {
    updatePage(activePage, (prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.isVisible } : c)),
    );
  }

  function handleRemove(id: string) {
    updatePage(activePage, (prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function handleSave() {
    startTransition(async () => {
      const error = await updateLayout(businessId, layout);
      if (error) toast.error("Failed to save layout.");
      else toast.success("Layout saved.");
    });
  }

  // renders a ghost preview while dragging
  function renderDragOverlay() {
    if (!draggingType) return null;
    const Block = BLOCK_MAP[draggingType.type];
    const props = DEFAULT_PROPS[draggingType.type];

    return (
      <div className="opacity-80 shadow-xl rounded-xl overflow-hidden border border-primary ring-2 ring-primary ring-offset-2 bg-background pointer-events-none">
        {Block ? (
          <Block props={props} onChange={() => {}} />
        ) : (
          <div className="px-8 py-10 flex items-center justify-center">
            <p className="text-sm text-muted-foreground capitalize">
              {draggingType.type.replace(/_/g, " ")}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    // DndContext now wraps everything — palette + canvas
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6">
        {/* Left sidebar */}
        <aside className="w-64 shrink-0 flex flex-col gap-4">
          {selected ? (
            <PropsPanel
              component={selected}
              onChange={(newProps) => handlePropsChange(selected.id, newProps)}
              onClose={() => setSelectedId(null)}
            />
          ) : (
            <Palette onAdd={handleAdd} />
          )}
        </aside>

        {/* Canvas area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <Tabs
            value={activePage}
            onValueChange={(v) => {
              setActivePage(v as PageKey);
              setSelectedId(null);
            }}
          >
            <div className="flex items-center justify-between">
              <TabsList>
                {PAGE_KEYS.map((page) => (
                  <TabsTrigger key={page} value={page} className="capitalize">
                    {page}
                  </TabsTrigger>
                ))}
              </TabsList>

              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={isPending}
                size="sm"
              >
                {isPending ? <Spinner /> : <Save className="size-4" />}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>

            {PAGE_KEYS.map((page) => (
              <TabsContent key={page} value={page} className="mt-4">
                <Canvas
                  layout={layout[page]}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onToggleVisible={handleToggleVisible}
                  onRemove={handleRemove}
                  onPropsChange={handlePropsChange}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* floating preview shown while dragging */}
      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {renderDragOverlay()}
      </DragOverlay>
    </DndContext>
  );
}
