// _components/Builder.tsx
"use client";

import { updateLayout } from "@/actions/layout";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Layout, PageComponent } from "@/types/feast";
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

export default function Builder({
  initialLayout,
  businessId,
}: {
  initialLayout: Layout;
  businessId: string;
}) {
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [isPending, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }, // prevents accidental drags
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setLayout((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id);
      const newIndex = prev.findIndex((c) => c.id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  function handleAdd(type: PageComponent["type"]) {
    const newComponent: PageComponent = {
      id: `${type}-${Date.now()}`,
      type,
      visible: true,
    };
    setLayout((prev) => [...prev, newComponent]);
  }

  function handleToggleVisible(id: string) {
    setLayout((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)),
    );
  }

  function handleRemove(id: string) {
    setLayout((prev) => prev.filter((c) => c.id !== id));
  }

  function handleSave() {
    startTransition(async () => {
      const error = await updateLayout(businessId, layout);
      if (error) {
        toast.error("Failed to save layout.");
      } else {
        toast.success("Layout saved.");
      }
    });
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 flex flex-col gap-6">
        <ComponentPalette
          onAdd={handleAdd}
          existingTypes={layout.map((c) => c.type)}
        />
      </aside>

      {/* Canvas */}
      <div className="flex-1 flex flex-col gap-4">
        <p>Menu page | Catering page | Shop page | About page | Gallery page</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Canvas
            layout={layout}
            onToggleVisible={handleToggleVisible}
            onRemove={handleRemove}
          />
        </DndContext>

        <Button
          variant="secondary"
          onClick={handleSave}
          disabled={isPending}
          className="self-end"
        >
          {isPending ? <Spinner /> : <Save />}
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
