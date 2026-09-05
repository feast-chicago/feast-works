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
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Save } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import Canvas from "./Canvas";
import ComponentPalette from "./ComponentPalette";
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
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
      prev.map((component) =>
        component.id === id
          ? { ...component, visible: !component.isVisible }
          : component,
      ),
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

  return (
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
          <ComponentPalette onAdd={handleAdd} />
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Canvas
                  layout={layout[page]}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                  onToggleVisible={handleToggleVisible}
                  onRemove={handleRemove}
                  onPropsChange={handlePropsChange}
                />
              </DndContext>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
