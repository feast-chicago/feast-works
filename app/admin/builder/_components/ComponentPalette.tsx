"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageComponent } from "@/types/feast";
import {
  Clock,
  HeartPlus,
  Image,
  MapPin,
  MessageSquareHeart,
  SquareDashedMousePointer,
  TextAlignStart,
  Type,
  UnfoldVertical,
} from "lucide-react";

const AVAILABLE_COMPONENTS: {
  type: PageComponent["type"];
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "header",
    label: "Header",
    description: "Heading",
    icon: <Type className="size-7" />,
  },
  {
    type: "text",
    label: "Text",
    description: "Body text",
    icon: <TextAlignStart className="size-7" />,
  },
  {
    type: "image",
    label: "Image",
    description: "",
    icon: <Image className="size-7" />,
  },
  {
    type: "button",
    label: "Button",
    description: "",
    icon: <SquareDashedMousePointer className="size-7" />,
  },
  {
    type: "hours",
    label: "Hours",
    description: "Operating hours and contact info",
    icon: <Clock className="size-7" />,
  },
  {
    type: "reviews",
    label: "Review",
    description: "Customer reviews",
    icon: <MessageSquareHeart className="size-7" />,
  },
  {
    type: "social",
    label: "Social",
    description: "",
    icon: <HeartPlus className="size-7" />,
  },
  {
    type: "map",
    label: "Map",
    description: "Your location on a map",
    icon: <MapPin className="size-7" />,
  },
  {
    type: "divider",
    label: "Divider",
    description: "A visual break between sections",
    icon: <UnfoldVertical className="size-7" />,
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
      <div className="grid grid-cols-3 gap-3">
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
