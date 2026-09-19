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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { Switch } from "@/components/ui/switch";
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
  const [borderColor, setBorderColor] = useState("");

  const [isPaddingAllEnabled, setIsPaddingAllEnabled] = useState(false);
  const [minPadding, maxPadding] = [0, 50];
  const [paddingAll, setPaddingAll] = useState(minPadding);
  const [paddingTop, setPaddingTop] = useState(minPadding);
  const [paddingBottom, setPaddingBottom] = useState(minPadding);
  const [paddingLeft, setPaddingLeft] = useState(minPadding);
  const [paddingRight, setPaddingRight] = useState(minPadding);

  const [isMarginAllEnabled, setIsMarginAllEnabled] = useState(false);
  const [minMargin, maxMargin] = [0, 50];
  const [marginAll, setMarginAll] = useState(minMargin);
  const [marginTop, setMarginTop] = useState(minMargin);
  const [marginBottom, setMarginBottom] = useState(minMargin);
  const [marginLeft, setMarginLeft] = useState(minMargin);
  const [marginRight, setMarginRight] = useState(minMargin);

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

  function handleInputChange(
    value: string,
    setValue: Dispatch<SetStateAction<number>>,
    maxValue: number,
  ) {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue === "") {
      setValue(0);
      return;
    }

    const numValue = parseInt(cleanValue, 10);

    if (numValue > maxValue) {
      setValue(maxValue);
    } else {
      setValue(numValue);
    }
  }

  function handleSliderChange(
    newValue: number[],
    setValue: Dispatch<SetStateAction<number>>,
  ) {
    const val = newValue[0];
    setValue(val);
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
                  onChange={(e) => {
                    const { value } = e.target;
                    const numValue = parseInt(value);

                    handleInputChange(value, setBorderWidth, maxBorderWidth);
                    update({
                      border: { ...props.border, width: numValue },
                    });
                  }}
                  className="w-10! text-center"
                />
              </span>
              <Slider
                value={[borderWidth]}
                onValueChange={([borderWidth]) => {
                  handleSliderChange([borderWidth], setBorderWidth);
                  update({
                    border: { ...props.border, width: borderWidth },
                  });
                }}
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
                      color={borderColor}
                      setColor={setBorderColor}
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
          <AccordionContent className="h-fit flex flex-col gap-5">
            <p className="text-xs text-muted-foreground">
              Add space between the <span className="italic">inside</span> of
              the border and your block.
            </p>

            <Field orientation="horizontal" className="max-w-sm">
              <FieldContent>
                <FieldLabel htmlFor="padding-all-sides">
                  Apply to all sides
                </FieldLabel>
                <FieldDescription className="text-xs">
                  Add the same amount of padding to all sides at once.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="padding-all-sides"
                checked={isPaddingAllEnabled}
                onCheckedChange={setIsPaddingAllEnabled}
              />
            </Field>
            {/* Padding */}
            {isPaddingAllEnabled ? (
              <Field>
                <span className="flex flex-row justify-between">
                  <FieldLabel htmlFor="padding-all">Padding</FieldLabel>
                  <Input
                    id="padding-all"
                    placeholder="0"
                    value={paddingAll}
                    onChange={(e) => {
                      const { value } = e.target;
                      const numValue = parseInt(value);

                      handleInputChange(value, setPaddingAll, maxPadding);
                      update({
                        padding: {
                          top: numValue,
                          bottom: numValue,
                          left: numValue,
                          right: numValue,
                        },
                      });
                    }}
                    className="w-10! text-center"
                  />
                </span>
                <Slider
                  value={[paddingAll]}
                  onValueChange={([paddingAll]) => {
                    handleSliderChange([paddingAll], setPaddingAll);
                    update({
                      padding: {
                        top: paddingAll,
                        bottom: paddingAll,
                        left: paddingAll,
                        right: paddingAll,
                      },
                    });
                  }}
                  min={minPadding}
                  max={maxPadding}
                  step={1}
                />
              </Field>
            ) : (
              <>
                {/* Top */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="padding-top">Top</FieldLabel>
                    <Input
                      id="padding-top"
                      placeholder="0"
                      value={paddingTop}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setPaddingTop, maxPadding);
                        update({
                          padding: { ...props.padding, top: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[paddingTop]}
                    onValueChange={([paddingTop]) => {
                      handleSliderChange([paddingTop], setPaddingTop);
                      update({
                        padding: { ...props.padding, top: paddingTop },
                      });
                    }}
                    min={minPadding}
                    max={maxPadding}
                    step={1}
                  />
                </Field>

                {/* Bottom */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="padding-bottom">Bottom</FieldLabel>
                    <Input
                      id="padding-bottom"
                      placeholder="0"
                      value={paddingBottom}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setPaddingBottom, maxPadding);
                        update({
                          padding: { ...props.padding, bottom: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[paddingBottom]}
                    onValueChange={([paddingBottom]) => {
                      handleSliderChange([paddingBottom], setPaddingBottom);
                      update({
                        padding: { ...props.padding, top: paddingBottom },
                      });
                    }}
                    min={minPadding}
                    max={maxPadding}
                    step={1}
                  />
                </Field>

                {/* Left */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="padding-left">Left</FieldLabel>
                    <Input
                      id="padding-left"
                      placeholder="0"
                      value={paddingLeft}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setPaddingLeft, maxPadding);
                        update({
                          padding: { ...props.padding, left: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[paddingLeft]}
                    onValueChange={([paddingLeft]) => {
                      handleSliderChange([paddingLeft], setPaddingLeft);
                      update({
                        padding: { ...props.padding, top: paddingLeft },
                      });
                    }}
                    min={minPadding}
                    max={maxPadding}
                    step={1}
                  />
                </Field>

                {/* Right */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="padding-right">Right</FieldLabel>
                    <Input
                      id="padding-right"
                      placeholder="0"
                      value={paddingRight}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setPaddingRight, maxPadding);
                        update({
                          padding: { ...props.padding, right: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[paddingRight]}
                    onValueChange={([paddingRight]) => {
                      handleSliderChange([paddingRight], setPaddingRight);
                      update({
                        padding: { ...props.padding, top: paddingRight },
                      });
                    }}
                    min={minPadding}
                    max={maxPadding}
                    step={1}
                  />
                </Field>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Margin */}
      <Accordion type="single" collapsible className="rounded-lg border">
        <AccordionItem value="margin" className="px-4">
          <AccordionTrigger>Margin</AccordionTrigger>
          <AccordionContent className="h-fit flex flex-col gap-5">
            <p className="text-xs text-muted-foreground">
              Add space between the <span className="italic">outside</span> of
              the border and your block.
            </p>

            <Field orientation="horizontal" className="max-w-sm">
              <FieldContent>
                <FieldLabel htmlFor="margin-all-sides">
                  Apply to all sides
                </FieldLabel>
                <FieldDescription className="text-xs">
                  Add the same amount of margin to all sides at once.
                </FieldDescription>
              </FieldContent>
              <Switch
                id="margin-all-sides"
                checked={isMarginAllEnabled}
                onCheckedChange={setIsMarginAllEnabled}
              />
            </Field>
            {/* Margin */}
            {isMarginAllEnabled ? (
              <Field>
                <span className="flex flex-row justify-between">
                  <FieldLabel htmlFor="margin-all">Margin</FieldLabel>
                  <Input
                    id="margin-all"
                    placeholder="0"
                    value={marginAll}
                    onChange={(e) => {
                      const { value } = e.target;
                      const numValue = parseInt(value);

                      handleInputChange(value, setMarginAll, maxMargin);
                      update({
                        margin: {
                          top: numValue,
                          bottom: numValue,
                          left: numValue,
                          right: numValue,
                        },
                      });
                    }}
                    className="w-10! text-center"
                  />
                </span>
                <Slider
                  value={[marginAll]}
                  onValueChange={([marginAll]) => {
                    handleSliderChange([marginAll], setMarginAll);
                    update({
                      margin: {
                        top: marginAll,
                        bottom: marginAll,
                        left: marginAll,
                        right: marginAll,
                      },
                    });
                  }}
                  min={minMargin}
                  max={maxMargin}
                  step={1}
                />
              </Field>
            ) : (
              <>
                {/* Top */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="margin-top">Top</FieldLabel>
                    <Input
                      id="margin-top"
                      placeholder="0"
                      value={marginTop}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setMarginTop, maxMargin);
                        update({
                          margin: { ...props.margin, top: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[marginTop]}
                    onValueChange={([marginTop]) => {
                      handleSliderChange([marginTop], setMarginTop);
                      update({
                        margin: { ...props.margin, top: marginTop },
                      });
                    }}
                    min={minMargin}
                    max={maxMargin}
                    step={1}
                  />
                </Field>

                {/* Bottom */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="margin-bottom">Bottom</FieldLabel>
                    <Input
                      id="margin-bottom"
                      placeholder="0"
                      value={marginBottom}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setMarginBottom, maxMargin);
                        update({
                          margin: { ...props.margin, bottom: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[marginBottom]}
                    onValueChange={([marginBottom]) => {
                      handleSliderChange([marginBottom], setMarginBottom);
                      update({
                        margin: { ...props.margin, top: marginBottom },
                      });
                    }}
                    min={minMargin}
                    max={maxMargin}
                    step={1}
                  />
                </Field>

                {/* Left */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="margin-left">Left</FieldLabel>
                    <Input
                      id="margin-left"
                      placeholder="0"
                      value={marginLeft}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setMarginLeft, maxMargin);
                        update({
                          margin: { ...props.margin, left: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[marginLeft]}
                    onValueChange={([marginLeft]) => {
                      handleSliderChange([marginLeft], setMarginLeft);
                      update({
                        margin: { ...props.margin, top: marginLeft },
                      });
                    }}
                    min={minMargin}
                    max={maxMargin}
                    step={1}
                  />
                </Field>

                {/* Right */}
                <Field>
                  <span className="flex flex-row justify-between">
                    <FieldLabel htmlFor="margin-right">Right</FieldLabel>
                    <Input
                      id="margin-right"
                      placeholder="0"
                      value={marginRight}
                      onChange={(e) => {
                        const { value } = e.target;
                        const numValue = parseInt(value);

                        handleInputChange(value, setMarginRight, maxMargin);
                        update({
                          margin: { ...props.margin, right: numValue },
                        });
                      }}
                      className="w-10! text-center"
                    />
                  </span>
                  <Slider
                    value={[marginRight]}
                    onValueChange={([marginRight]) => {
                      handleSliderChange([marginRight], setMarginRight);
                      update({
                        margin: { ...props.margin, top: marginRight },
                      });
                    }}
                    min={minMargin}
                    max={maxMargin}
                    step={1}
                  />
                </Field>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </FieldGroup>
  );
}
