// update Canvas.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { Business, PageComponent } from "@/schema";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  PanelLeft,
  Plus,
  RotateCw,
  Share,
  TvMinimal,
} from "lucide-react";
import Link from "next/link";
import { BLOCK_MAP } from "./Blocks";
import BuilderBlock from "./BuilderBlock";

export default function Canvas({
  business,
  layout,
  selectedId,
  onSelect,
  onToggleVisible,
  onRemove,
  onPropsChange,
}: {
  business: Business;
  layout: PageComponent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisible: (id: string) => void;
  onRemove: (id: string) => void;
  onPropsChange: (id: string, newProps: Record<string, unknown>) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
    data: { source: "canvas" },
  });

  return (
    <div
      ref={setNodeRef}
      className="h-full flex flex-col grow rounded-xl border overflow-hidden"
    >
      {/* macOS-themed Toolbar */}
      <span className="w-full h-12 p-2.5 flex gap-4 items-center border-b bg-muted">
        <span className="flex gap-1.5">
          <span className="size-3.5 rounded-full bg-[#ff5c60]" />
          <span className="size-3.5 rounded-full bg-[#fac800]" />
          <span className="size-3.5 rounded-full bg-[#35c759]" />
        </span>

        <span className="w-fit h-7.5 flex px-1.5 py-1 gap-2 border border-border/40 justify-center items-center rounded-full">
          <PanelLeft className="size-4" />
          <ChevronDown className="size-4" />
        </span>

        <span className="w-fit h-7.5 flex px-1.5 py-1 gap-0.5 border border-border/40 justify-center items-center rounded-full">
          <ChevronLeft className="size-5" />
          <Separator orientation="vertical" decorative />
          <ChevronRight className="size-5" />
        </span>

        <span className="mx-auto w-1/2 h-7.5 flex px-1.5 py-1 gap-0.5 border border-border/40 justify-between items-center rounded-full">
          <TvMinimal className="size-3.5" />
          <Link
            href={business.site_urls[business.site_urls.length - 1]}
            target="_blank"
          >
            {business.site_urls[business.site_urls.length - 1].split("//")[1]}
          </Link>
          <RotateCw className="size-3.5" />
        </span>

        <span className="ml-auto w-fit h-7.5 flex px-1.5 py-1 gap-2 border border-border/40 justify-center items-center rounded-full">
          <Share className="size-5" />
          <Plus className="size-5" />
          <Copy className="size-5" />
        </span>
      </span>

      <span
        className={`h-full p-10 transition-colors duration-150 overflow-y-scroll ${
          isOver ? "border-primary bg-white/5" : "border-border/60 bg-white"
        }`}
      >
        {layout.length === 0 ? (
          <div className="h-full flex flex-col flex-1 justify-center items-center gap-2 py-20 text-center">
            <p className="text-sm text-muted-foreground">
              {isOver
                ? "Drop to add section"
                : "Add sections from the left panel"}
            </p>
            <p className="text-xs text-muted-foreground/60">
              Drag from palette or click to add · Double-click text to edit
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
                      theme={business.theme}
                    />
                  ) : (
                    <div className="px-8 py-10 bg-muted/30 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground capitalize">
                        {component.type.replace(/_/g, " ")} section
                      </p>
                    </div>
                  )}
                </BuilderBlock>
              );
            })}

            {/* drop indicator at the bottom when dragging from palette */}
            {isOver && (
              <div className="h-1 rounded-full bg-primary animate-pulse" />
            )}
          </SortableContext>
        )}
      </span>
    </div>
  );
}
