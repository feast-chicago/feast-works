import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toProperCase } from "@/lib/utils";
import { Button, ButtonSchema } from "@/schema";
import { useState } from "react";
import AlignmentField from "../_fields/AlignmentField";
import { LinkField } from "../_fields/LinkField";
import TextFormatField from "../_fields/TextFormatField";
import SettingsAccordion from "./_shared/SettingsAccordion";

export default function ButtonSettings({
  value,
  // business,
  onChange,
}: {
  value: Button;
  // business: Business;
  onChange: (text: Button) => void;
}) {
  const [alignment, setAlignment] = useState<Button["alignment"]>(
    value.alignment ?? "left",
  );
  // const [color, setColor] = useState<Button["color"]>(value.color ?? "");
  const [textFormat, setTextFormat] = useState<Button["textFormat"]>(
    value.textFormat ?? [],
  );
  const [isFullWidth, setIsFullWidth] = useState<Button["isFullWidth"]>(
    value.isFullWidth ?? false,
  );
  const [size, setSize] = useState<Button["size"]>(value.size ?? "default");
  const [variant, setVariant] = useState<Button["variant"]>(
    value.variant ?? "default",
  );

  function patch(partial: Partial<Button>) {
    onChange({ ...value, ...partial });
  }

  return (
    <SettingsAccordion label="Button" value="button">
      {/* Variant */}
      <Field className="flex flex-row gap-5 justify-between items-center">
        <FieldLabel>Style</FieldLabel>
        <Select
          value={variant}
          onValueChange={(variant: Button["variant"]) => {
            setVariant(variant);
            patch({ variant });
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ButtonSchema.shape.variant.options.map((v) => (
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
          onValueChange={(size: Button["size"]) => {
            setSize(size);
            patch({ size });
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {ButtonSchema.shape.size.options.map((s) => (
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

      <TextFormatField
        textFormat={textFormat}
        setTextFormat={setTextFormat}
        patch={patch}
      />

      {/* <TextColorField
            business={business}
            color={color}
            setColor={setColor}
            patch={patch}
          /> */}

      <LinkField value={value.link} onChange={(link) => patch({ link })} />
    </SettingsAccordion>
  );
}
