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
import { BorderSchema, Business, TextProps } from "@/schema";
import { Dispatch, SetStateAction, useState } from "react";
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

  const [minBorderWidth, maxBorderWidth] = [0, 50];
  const [borderWidth, setBorderWidth] = useState(minBorderWidth);
  const [inputBorderWidth, setInputBorderWidth] = useState(
    minBorderWidth.toString(),
  );

  const [borderColor, setBorderColor] = useState("");

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

  function handleSliderChange(
    newValue: number[],
    setValue: Dispatch<SetStateAction<number>>,
    setInputValue: Dispatch<SetStateAction<string>>,
  ) {
    const val = newValue[0];
    setValue(val);
    setInputValue(val.toString());
  }

  function handleInputChange(
    value: string,
    setValue: Dispatch<SetStateAction<number>>,
    setInputValue: Dispatch<SetStateAction<string>>,
    maxValue: number,
  ) {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue === "") {
      setValue(0);
      setInputValue("0");
      return;
    }

    const numValue = parseInt(cleanValue, 10);

    if (numValue > maxValue) {
      setValue(maxValue);
      setInputValue(maxValue.toString());
    } else {
      setValue(numValue);
      setInputValue(cleanValue);
    }
  }

  function handleBlur(
    value: string,
    setValue: Dispatch<SetStateAction<string>>,
    minValue: number,
  ) {
    if (value !== "") {
      const numValue = parseInt(value, 10);
      if (numValue < minValue) {
        setValue(minValue.toString());
      }
    } else {
      setValue(minValue.toString());
    }
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
          <AccordionContent className="h-fit flex flex-col gap-5">
            {/* Border Width */}
            <Field>
              <span className="flex flex-row justify-between">
                <FieldLabel htmlFor="border-thickness">Thickness</FieldLabel>
                <Input
                  id="border-thickness"
                  placeholder="0"
                  value={borderWidth}
                  onChange={(e) =>
                    handleInputChange(
                      e.target.value,
                      setBorderWidth,
                      setInputBorderWidth,
                      maxBorderWidth,
                    )
                  }
                  onBlur={() =>
                    handleBlur(
                      inputBorderWidth,
                      setInputBorderWidth,
                      minBorderWidth,
                    )
                  }
                  className="w-10! text-center"
                />
              </span>
              <Slider
                value={[borderWidth]} // Shadcn Slider requires an array for single or multi-range handles
                onValueChange={([borderWidth]) =>
                  handleSliderChange(
                    [borderWidth],
                    setBorderWidth,
                    setInputBorderWidth,
                  )
                }
                min={minBorderWidth}
                max={maxBorderWidth}
                step={1}
              />
            </Field>

            <Separator decorative />
            {/* Border Color */}
            <Field>
              <span className="flex flex-row justify-between gap-7">
                <FieldLabel htmlFor="border-color">Color</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="border-color"
                    autoComplete="off"
                    placeholder="Choose a color..."
                    value={borderColor}
                    onChange={(e) => {
                      setBorderColor(e.target.value);
                      update({
                        border: { ...props.border, color: e.target.value },
                      });
                    }}
                  />
                  <InputGroupAddon align="inline-start">
                    <ColorPickerPopover
                      color={backgroundColor}
                      setColor={setBackgroundColor}
                      onClick={() =>
                        update({
                          border: { ...props.border, color: borderColor },
                        })
                      }
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
                  onClick={() => {
                    setBorderColor(primary_color);
                    update({
                      border: { ...props.border, color: primary_color },
                    });
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
                      setBorderColor(secondary_color);
                      update({
                        border: { ...props.border, color: secondary_color },
                      });
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
                    setBorderColor("#f5f5f5");
                    update({
                      border: { ...props.border, color: "#f5f5f5" },
                    });
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
                    setBorderColor("");
                    update({
                      border: { ...props.border, color: "" },
                    });
                  }}
                >
                  Transparent
                </Button>
              </div>
            </Field>
            <Separator decorative />

            {/* Border Style */}
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
