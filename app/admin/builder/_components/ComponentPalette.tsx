"use client";

import { PageComponent } from "@/types/feast";

const AVAILABLE_COMPONENTS: {
  type: PageComponent["type"];
  label: string;
  description: string;
}[] = [
  { type: "hero", label: "Hero", description: "Full-width intro section" },
  { type: "menu", label: "Menu", description: "Your food and drink menu" },
  { type: "hours", label: "Hours", description: "Operating hours" },
  { type: "gallery", label: "Gallery", description: "Photo gallery" },
  {
    type: "testimonials",
    label: "Testimonials",
    description: "Customer reviews",
  },
  {
    type: "cta",
    label: "Call to Action",
    description: "Prompt visitors to act",
  },
  { type: "map", label: "Map", description: "Your location on a map" },
  { type: "about", label: "About", description: "Your story" },
  {
    type: "catering",
    label: "Catering",
    description: "Catering inquiry section",
  },
  { type: "shop", label: "Shop", description: "Merchandise section" },
];

export default function ComponentPalette({
  onAdd,
  existingTypes,
}: {
  onAdd: (type: PageComponent["type"]) => void;
  existingTypes: PageComponent["type"][];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
        Add a section
      </p>
      {AVAILABLE_COMPONENTS.map(({ type, label, description }) => {
        const alreadyAdded = existingTypes.includes(type);
        return (
          <button
            key={type}
            onClick={() => !alreadyAdded && onAdd(type)}
            disabled={alreadyAdded}
            className={`text-left p-3 rounded-lg border transition-colors
              ${
                alreadyAdded
                  ? "opacity-40 cursor-not-allowed border-border"
                  : "border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
              }`}
          >
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </button>
        );
      })}
    </div>
  );
}
