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
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { BorderProps, BorderSchema, Business } from "@/schema";
import { useState } from "react";

type BorderStyle = BorderProps["style"];
const [MIN, MAX] = [0, 50];

export default function BorderSettings({
  value,
  business,
  onChange,
}: {
  value: BorderProps;
  business: Business;
  onChange: (border: BorderProps) => void;
}) {
  const [width, setWidth] = useState(value.width ?? MIN);
  const [color, setColor] = useState(value.color ?? "");
  const {
    primary_color,
    primary_color_foreground,
    secondary_color,
    secondary_color_foreground,
  } = business.theme;

  function patch(partial: Partial<BorderProps>) {
    onChange({ ...value, ...partial });
  }

  function handleWidthInput(raw: string) {
    const clean = raw.replace(/\D/g, "");
    const n = Math.min(parseInt(clean || "0"), MAX);
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
          <Field>
            <span className="flex flex-row justify-between">
              <FieldLabel htmlFor="border-thickness">Thickness</FieldLabel>
              <Input
                id="border-thickness"
                placeholder="0"
                value={width}
                onChange={(e) => handleWidthInput(e.target.value)}
                className="w-10! text-center"
              />
            </span>
            <Slider
              value={[width]}
              onValueChange={([v]) => {
                setWidth(v);
                patch({ width: v });
              }}
              min={MIN}
              max={MAX}
              step={1}
            />
          </Field>

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
          <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
            <FieldLabel>Style</FieldLabel>
            <Select
              value={value.style}
              onValueChange={(v: BorderStyle) => patch({ style: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {BorderSchema.shape.style.options.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
