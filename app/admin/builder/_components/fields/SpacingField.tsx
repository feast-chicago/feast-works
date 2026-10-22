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
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { SpacingProps } from "@/schema";
import { useState } from "react";
import z from "zod";

const [MIN, MAX] = [0, 50];

function SpacingSlider({
  label,
  id,
  value,
  onChange,
}: {
  label: string;
  id: string;
  value: number;
  onChange: (n: number) => void;
}) {
  function handleInput(raw: string) {
    const n = Math.min(parseInt(raw.replace(/\D/g, "") || "0"), MAX);
    onChange(n);
  }

  return (
    <Field>
      <span className="flex flex-row justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input
          id={id}
          placeholder="0"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          className="w-10! text-center"
        />
      </span>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={MIN}
        max={MAX}
        step={1}
      />
    </Field>
  );
}

export default function SpacingField({
  label,
  description,
  accordionValue,
  value,
  onChange,
}: {
  label: "Padding" | "Margin";
  description: "inside" | "outside";
  accordionValue: string;
  value: SpacingProps;
  onChange: (spacing: SpacingProps) => void;
}) {
  const [allEnabled, setAllEnabled] = useState(false);
  const [allValue, setAllValue] = useState(MIN);

  function setAll(n: number) {
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

          <Field orientation="horizontal" className="max-w-sm">
            <FieldContent>
              <FieldLabel>Apply to all sides</FieldLabel>
              <FieldDescription className="text-xs">
                Add the same amount of {label.toLowerCase()} to all sides at
                once.
              </FieldDescription>
            </FieldContent>
            <Switch checked={allEnabled} onCheckedChange={setAllEnabled} />
          </Field>

          {allEnabled ? (
            <SpacingSlider
              label={label}
              id={`${accordionValue}-all`}
              value={allValue}
              onChange={setAll}
            />
          ) : (
            <>
              <SpacingSlider
                label="Top"
                id={`${accordionValue}-top`}
                value={value.top}
                onChange={(n) => onChange({ ...value, top: n })}
              />
              <SpacingSlider
                label="Bottom"
                id={`${accordionValue}-bottom`}
                value={value.bottom}
                onChange={(n) => onChange({ ...value, bottom: n })}
              />
              <SpacingSlider
                label="Left"
                id={`${accordionValue}-left`}
                value={value.left}
                onChange={(n) => onChange({ ...value, left: n })}
              />
              <SpacingSlider
                label="Right"
                id={`${accordionValue}-right`}
                value={value.right}
                onChange={(n) => onChange({ ...value, right: n })}
              />
            </>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
