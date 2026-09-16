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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { BorderSchema, Business, TextProps } from "@/schema";
import { useState } from "react";
import z from "zod";

export default function BlockEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: TextProps;
  onChange: (props: TextProps) => void;
}) {
  const [backgroundColor, setBackgroundColor] = useState("");
  const { theme } = business;
  const {
    primary_color,
    primary_color_foreground,
    secondary_color,
    secondary_color_foreground,
  } = theme;

  function update(patch: Partial<TextProps>) {
    onChange({ ...props, ...patch });
  }

  type BorderStyle = z.infer<typeof BorderSchema>["style"];

  return (
    <FieldGroup>
      {/* Background Color */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="border" className="px-4">
          <AccordionTrigger>Background Color</AccordionTrigger>
          <AccordionContent>
            <Field>
              <InputGroup>
                <InputGroupInput
                  id="background-color"
                  autoComplete="off"
                  placeholder="Choose a color..."
                  value={backgroundColor}
                  onChange={(e) => {
                    setBackgroundColor(e.target.value);
                    update({ backgroundColor: e.target.value });
                  }}
                />
                <InputGroupAddon align="inline-start">
                  <ColorPickerPopover
                    color={backgroundColor}
                    setColor={setBackgroundColor}
                    onClick={() => update({ backgroundColor })}
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
                  onClick={() => {
                    setBackgroundColor(primary_color);
                    update({ backgroundColor: primary_color });
                  }}
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
                    onClick={() => {
                      setBackgroundColor(secondary_color);
                      update({ backgroundColor: secondary_color });
                    }}
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
                  onClick={() => {
                    setBackgroundColor("#f5f5f5");
                    update({ backgroundColor: "#f5f5f5" });
                  }}
                >
                  Muted
                </Button>
                <Button
                  size="sm"
                  style={{
                    backgroundColor: "#00000000",
                    color: "#000000",
                  }}
                  onClick={() => {
                    setBackgroundColor("");
                    update({ backgroundColor: "" });
                  }}
                >
                  Transparent
                </Button>
              </div>
            </Field>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Border */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="border" className="px-4">
          <AccordionTrigger>Border</AccordionTrigger>
          <AccordionContent>
            <p>Thickness</p>
            <p>Color</p>

            <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
              <FieldLabel>Style</FieldLabel>
              <Select
                value={props.border.style}
                onValueChange={(value: BorderStyle) =>
                  update({ border: { ...props.border, style: value } })
                }
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

      {/* Padding */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="padding" className="px-4">
          <AccordionTrigger>Padding</AccordionTrigger>
          <AccordionContent>
            <p>Add space between the inside of the border and your text.</p>
            <p>Apply to all sides</p>
            <p>Top, Bottom, Left, Right</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Margin */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="margin" className="px-4">
          <AccordionTrigger>Margin</AccordionTrigger>
          <AccordionContent>
            <p>
              Add space between the outside of the border and your text block.
            </p>
            <p>Apply to all sides</p>
            <p>Top, Bottom, Left, Right</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <Field>
        <FieldLabel>Heading</FieldLabel>
        <Input
          value={props.heading ?? ""}
          onChange={(e) => update({ heading: e.target.value })}
          placeholder="Your heading here"
        />
      </Field> */}

      {/*  {props.button && (
        <>
          <Field>
            <FieldLabel>Button link</FieldLabel>
            <Input
              value={props.button.href ?? ""}
              onChange={(e) =>
                update({
                  button: { ...props.button!, href: e.target.value },
                })
              }
              placeholder="https:// or /menu"
            />
          </Field>

          <Field>
            <FieldLabel>Button style</FieldLabel>
            <Select
              value={props.button.variant}
              onValueChange={(v) =>
                update({
                  button: { ...props.button!, variant: v as any },
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="ghost">Ghost</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </>
      )} */}
    </FieldGroup>
  );
}
