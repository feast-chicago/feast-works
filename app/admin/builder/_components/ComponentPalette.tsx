"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageComponent } from "@/types/feast";
import { AlignLeft, Clock, MapPin, MessageSquare, Minus } from "lucide-react";

const AVAILABLE_COMPONENTS: {
  type: PageComponent["type"];
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "text",
    label: "Text",
    description: "Heading, body text, button, or link",
    icon: <AlignLeft className="size-5" />,
  },
  {
    type: "hours",
    label: "Hours",
    description: "Operating hours and contact info",
    icon: <Clock className="size-5" />,
  },
  {
    type: "reviews",
    label: "Reviews",
    description: "Customer reviews",
    icon: <MessageSquare className="size-5" />,
  },
  {
    type: "map",
    label: "Map",
    description: "Your location on a map",
    icon: <MapPin className="size-5" />,
  },
  {
    type: "divider",
    label: "Divider",
    description: "A visual break between sections",
    icon: <Minus className="size-5" />,
  },
];

export default function ComponentPalette({
  onAdd,
}: {
  onAdd: (type: PageComponent["type"]) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
        Add a section
      </p>
      {/* Fix issue 2 — 2-column grid */}
      <div className="grid grid-cols-2 gap-2">
        {AVAILABLE_COMPONENTS.map(({ type, label, description, icon }) => (
          <Tooltip key={type}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onAdd(type)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-center"
              >
                <span className="text-muted-foreground">{icon}</span>
                <span className="text-xs font-medium leading-tight">
                  {label}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
