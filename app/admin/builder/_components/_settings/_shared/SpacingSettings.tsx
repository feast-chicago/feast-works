"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Spacing } from "@/schema";
import { useState } from "react";
import SliderField from "../../_fields/_shared/SliderField";
import SwitchField from "../../_fields/_shared/SwitchField";

const [MIN, MAX] = [0, 50];

export default function SpacingSettings({
  label,
  description,
  accordionValue,
  value,
  onChange,
}: {
  label: "Padding" | "Margin";
  description: "inside" | "outside";
  accordionValue: string;
  value: Spacing;
  onChange: (spacing: Spacing) => void;
}) {
  const [allEnabled, setAllEnabled] = useState(false);
  const [allValue, setAllValue] = useState(MIN);

  function setAll(raw: string) {
    const clean = raw.replace(/\D/g, "");
    const n = parseInt(clean || "0");
    setAllValue(n);
    onChange({ top: n, bottom: n, left: n, right: n });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value={accordionValue} className="px-4">
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          <p className="text-xs text-muted-foreground">
            Add space between the <span className="italic">{description}</span>{" "}
            of the border and your block.
          </p>

          <SwitchField
            id={`${accordionValue}-all`}
            label="Apply to all sides"
            description={`Add the same amount of ${label.toLowerCase()} to all sides at once.`}
            checked={allEnabled}
            onChange={setAllEnabled}
          />

          {allEnabled ? (
            <SliderField
              id={`${accordionValue}-all`}
              label={label}
              value={allValue}
              min={MIN}
              max={MAX}
              onChange={setAll}
            />
          ) : (
            <>
              <SliderField
                id={`${accordionValue}-top`}
                label="Top"
                value={value.top}
                min={MIN}
                max={MAX}
                onChange={(top) => onChange({ ...value, top: parseInt(top) })}
              />

              <SliderField
                id={`${accordionValue}-bottom`}
                label="Bottom"
                value={value.bottom}
                min={MIN}
                max={MAX}
                onChange={(bottom) =>
                  onChange({ ...value, bottom: parseInt(bottom) })
                }
              />

              <SliderField
                id={`${accordionValue}-left`}
                label="Left"
                value={value.left}
                min={MIN}
                max={MAX}
                onChange={(left) =>
                  onChange({ ...value, left: parseInt(left) })
                }
              />

              <SliderField
                id={`${accordionValue}-right`}
                label="Right"
                value={value.right}
                min={MIN}
                max={MAX}
                onChange={(right) =>
                  onChange({ ...value, right: parseInt(right) })
                }
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
