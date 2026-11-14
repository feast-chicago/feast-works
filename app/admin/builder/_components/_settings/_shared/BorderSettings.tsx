"use client";

import ColorPickerPopover from "@/components/ColorPickerPopover";
import { SeparatorWithText } from "@/components/SeparatorWithText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Border, BorderSchema, Business } from "@/schema";
import { useState } from "react";
import SelectField from "../../_fields/_shared/SelectField";
import SliderField from "../../_fields/_shared/SliderField";

type BorderStyle = Border["style"];
const [MIN, MAX] = [0, 50];

export default function BorderSettings({
  value,
  business,
  onChange,
}: {
  value: Border;
  business: Business;
  onChange: (border: Border) => void;
}) {
  const [width, setWidth] = useState(value.width ?? MIN);
  const [color, setColor] = useState(value.color ?? "");
  const {
    primary_color,
    primary_color_foreground,
    secondary_color,
    secondary_color_foreground,
  } = business.theme;

  function patch(partial: Partial<Border>) {
    onChange({ ...value, ...partial });
  }

  function handleWidthInput(raw: string) {
    const clean = raw.replace(/\D/g, "");
    const n = parseInt(clean || "0");
    setWidth(n);
    patch({ width: n });
  }

  function setColorAndPatch(c: string) {
    setColor(c);
    patch({ color: c });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="border" className="px-4">
        <AccordionTrigger>Border</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          {/* Width */}
          <SliderField
            id="border-width"
            label="Thickness"
            value={width}
            min={MIN}
            max={MAX}
            step={1}
            onChange={handleWidthInput}
          />

          <Separator decorative />

          {/* Color */}
          <Field>
            <span className="flex flex-row justify-between gap-7">
              <FieldLabel htmlFor="border-color">Color</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="border-color"
                  autoComplete="off"
                  placeholder="Choose a color..."
                  value={color}
                  onChange={(e) => setColorAndPatch(e.target.value)}
                />
                <InputGroupAddon align="inline-start">
                  <ColorPickerPopover
                    color={color}
                    setColor={setColor}
                    onClick={() => patch({ color })}
                  />
                </InputGroupAddon>
              </InputGroup>
            </span>

            <SeparatorWithText text="or" />

            {/* Color Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="sm"
                style={{
                  backgroundColor: primary_color,
                  color: primary_color_foreground,
                }}
                onClick={() => setColorAndPatch(primary_color)}
              >
                Primary
              </Button>
              {secondary_color && secondary_color_foreground && (
                <Button
                  size="sm"
                  style={{
                    backgroundColor: secondary_color,
                    color: secondary_color_foreground,
                  }}
                  onClick={() => setColorAndPatch(secondary_color)}
                >
                  Secondary
                </Button>
              )}
              <Button
                size="sm"
                style={{
                  backgroundColor: "#f5f5f5",
                  color: "#737373",
                }}
                onClick={() => setColorAndPatch("#f5f5f5")}
              >
                Muted
              </Button>
              <Button
                size="sm"
                style={{
                  backgroundColor: "#00000000",
                  color: "#000000",
                }}
                onClick={() => setColorAndPatch("")}
              >
                Transparent
              </Button>
            </div>
          </Field>

          <Separator decorative />

          {/* Style */}
          <SelectField
            id="border-style"
            label="Style"
            value={value.style}
            placeholder="Choose"
            options={BorderSchema.shape.style.options}
            onChange={(style: BorderStyle) => patch({ style })}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
