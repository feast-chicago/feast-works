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
import { Field } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Business } from "@/schema";
import { useState } from "react";

export default function BackgroundColorField({
  value,
  business,
  onChange,
}: {
  value: string;
  business: Business;
  onChange: (color: string) => void;
}) {
  const [color, setColor] = useState(value);
  const {
    primary_color,
    primary_color_foreground,
    secondary_color,
    secondary_color_foreground,
  } = business.theme;

  function set(c: string) {
    setColor(c);
    onChange(c);
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="border" className="px-4">
        <AccordionTrigger>Background Color</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          <Field>
            <InputGroup>
              <InputGroupInput
                id="background-color"
                autoComplete="off"
                placeholder="Choose a color..."
                value={color}
                onChange={(e) => set(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <ColorPickerPopover
                  color={color}
                  setColor={setColor}
                  onClick={() => onChange(color)}
                />
              </InputGroupAddon>
            </InputGroup>

            <SeparatorWithText text="or" />

            <div className="grid grid-cols-2 gap-4">
              <Button
                size="sm"
                style={{
                  backgroundColor: primary_color,
                  color: primary_color_foreground,
                }}
                onClick={() => set(primary_color)}
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
                  onClick={() => set(secondary_color)}
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
                onClick={() => set("#f5f5f5")}
              >
                Muted
              </Button>
              <Button
                size="sm"
                style={{
                  backgroundColor: "#00000000",
                  color: "#000000",
                }}
                onClick={() => set("")}
              >
                Transparent
              </Button>
            </div>
          </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
