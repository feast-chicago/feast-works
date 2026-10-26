import ColorPickerPopover from "@/components/ColorPickerPopover";
import { SeparatorWithText } from "@/components/SeparatorWithText";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toProperCase } from "@/lib/utils";
import {
  AlignmentSchema,
  Business,
  FormatProps,
  FormatSchema,
  TextProps,
} from "@/schema";
import {
  Bold,
  Italic,
  Strikethrough,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  Underline,
} from "lucide-react";
import { useState } from "react";

export default function TextField({
  value,
  business,
  onChange,
}: {
  value: TextProps;
  business: Business;
  onChange: (text: TextProps) => void;
}) {
  const [alignment, setAlignment] = useState<TextProps["alignment"]>(
    value.alignment ?? "left",
  );
  const [format, setFormat] = useState<TextProps["format"]>(value.format ?? []);
  const [color, setColor] = useState<TextProps["color"]>(value.color ?? "");

  const {
    primary_color,
    primary_color_foreground,
    secondary_color,
    secondary_color_foreground,
  } = business.theme;

  function patch(partial: Partial<TextProps>) {
    onChange({ ...value, ...partial });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="text" className="px-4">
        <AccordionTrigger>Text</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          {/* Alignment */}
          <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
            <FieldLabel>Alignment</FieldLabel>
            <ButtonGroup>
              {AlignmentSchema.options.map((option) => (
                <Tooltip key={option}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      variant={alignment === option ? "secondary" : "outline"}
                      value={alignment}
                      onClick={() => {
                        setAlignment(alignment);
                        patch({ alignment });
                      }}
                    >
                      {option === "left" ? (
                        <TextAlignStart />
                      ) : option === "center" ? (
                        <TextAlignCenter />
                      ) : option === "right" ? (
                        <TextAlignEnd />
                      ) : (
                        <TextAlignJustify />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{toProperCase(option)} align</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </ButtonGroup>
          </Field>

          {/* Format */}
          <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
            <FieldLabel>Format</FieldLabel>
            <ButtonGroup>
              {FormatSchema.element.options.map((option) => (
                <Tooltip key={option}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon-sm"
                      variant={
                        format.includes(option) ? "secondary" : "outline"
                      }
                      value={format}
                      onClick={() => {
                        const f = option;
                        const newFormat: FormatProps = format.includes(f)
                          ? format.filter((el) => el !== f)
                          : [...format, f];

                        setFormat(newFormat);
                        patch({ format: newFormat });
                      }}
                    >
                      {option === "bold" ? (
                        <Bold />
                      ) : option === "italic" ? (
                        <Italic />
                      ) : option === "underline" ? (
                        <Underline />
                      ) : option === "strikethrough" ? (
                        <Strikethrough />
                      ) : (
                        <></>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{toProperCase(option)}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </ButtonGroup>
          </Field>

          {/* Color */}
          <Field>
            <span className="flex flex-row justify-between gap-7">
              <FieldLabel htmlFor="color">Color</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="color"
                  autoComplete="off"
                  placeholder="Choose a color..."
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    patch({ color: e.target.value });
                  }}
                />
                <InputGroupAddon align="inline-start">
                  <ColorPickerPopover
                    color={color}
                    setColor={setColor}
                    onClick={() => onChange({ ...value, color })}
                  />
                </InputGroupAddon>
              </InputGroup>
            </span>

            <SeparatorWithText text="or" />

            <div className="grid grid-cols-2 gap-4">
              <Button
                size="sm"
                style={{
                  backgroundColor: primary_color,
                  color: primary_color_foreground,
                }}
                onClick={() => {
                  setColor(primary_color);
                  patch({ color: primary_color });
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
                    setColor(secondary_color);
                    patch({ color: secondary_color });
                  }}
                >
                  Secondary
                </Button>
              )}
            </div>
          </Field>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
