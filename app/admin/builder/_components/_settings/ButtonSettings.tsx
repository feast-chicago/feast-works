import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonProps, ButtonPropsSchema } from "@/schema";
import { useState } from "react";
import AlignmentField from "../_fields/AlignmentField";
import FormatField from "../_fields/FormatField";
import { LinkField } from "../_fields/LinkField";
import { toProperCase } from "@/lib/utils";

export default function ButtonSettings({
  value,
  // business,
  onChange,
}: {
  value: ButtonProps;
  // business: Business;
  onChange: (text: ButtonProps) => void;
}) {
  const [alignment, setAlignment] = useState<ButtonProps["alignment"]>(
    value.alignment ?? "left",
  );
  // const [color, setColor] = useState<ButtonProps["color"]>(value.color ?? "");
  const [format, setFormat] = useState<ButtonProps["format"]>(
    value.format ?? [],
  );
  const [isFullWidth, setIsFullWidth] = useState<ButtonProps["isFullWidth"]>(
    value.isFullWidth ?? false,
  );
  const [size, setSize] = useState<ButtonProps["size"]>(
    value.size ?? "default",
  );
  const [variant, setVariant] = useState<ButtonProps["variant"]>(
    value.variant ?? "default",
  );

  function patch(partial: Partial<ButtonProps>) {
    onChange({ ...value, ...partial });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="button" className="px-4">
        <AccordionTrigger>Button</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          {/* Variant */}
          <Field className="flex flex-row gap-5 justify-between items-center">
            <FieldLabel>Style</FieldLabel>
            <Select
              value={variant}
              onValueChange={(variant: ButtonProps["variant"]) => {
                setVariant(variant);
                patch({ variant });
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ButtonPropsSchema.shape.variant.options.map((v) => (
                    <SelectItem key={v} value={v}>
                      {toProperCase(v)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {/* Size */}
          <Field className="flex flex-row gap-5 justify-between items-center">
            <FieldLabel>Size</FieldLabel>
            <Select
              value={size}
              onValueChange={(size: ButtonProps["size"]) => {
                setSize(size);
                patch({ size });
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {ButtonPropsSchema.shape.size.options.map((s) => (
                    <SelectItem key={s} value={s}>
                      {toProperCase(s)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <AlignmentField
            alignment={alignment}
            setAlignment={setAlignment}
            isFullWidth={isFullWidth}
            setIsFullWidth={setIsFullWidth}
            patch={patch}
            excludeJustify
            isButton
          />

          <FormatField format={format} setFormat={setFormat} patch={patch} />

          {/* <TextColorField
            business={business}
            color={color}
            setColor={setColor}
            patch={patch}
          /> */}

          <LinkField value={value.link} onChange={(link) => patch({ link })} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
