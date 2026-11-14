"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Business, Divider, DividerSchema } from "@/schema";
import { useState } from "react";
import SelectField from "../_fields/_shared/SelectField";
import SliderField from "../_fields/_shared/SliderField";
import TextColorField from "../_fields/TextColorField";

export default function DividerSettings({
  value,
  business,
  onChange,
}: {
  value: Divider;
  business: Business;
  onChange: (props: Divider) => void;
}) {
  const [color, setColor] = useState(value.color ?? "");

  function patch(partial: Partial<Divider>) {
    onChange({ ...value, ...partial });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="divider" className="px-4">
        <AccordionTrigger>Divider</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          <SelectField
            id="divider-style"
            label="Style"
            value={value.style}
            options={DividerSchema.shape.style.options}
            onChange={(style) => patch({ style })}
          />

          {value.style !== "blank" && (
            <>
              <SliderField
                id="divider-width"
                label="Thickness"
                value={value.thickness}
                min={1}
                max={10}
                onChange={(thickness) =>
                  patch({ thickness: parseInt(thickness) })
                }
              />
              <TextColorField
                business={business}
                color={color}
                setColor={setColor}
                patch={patch}
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
