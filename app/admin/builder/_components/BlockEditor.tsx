"use client";

import { FieldGroup } from "@/components/ui/field";
import { Business, TextProps } from "@/schema";
import BackgroundColorField from "./fields/BackgroundColorField";
import BorderField from "./fields/BorderField";
import SpacingField from "./fields/SpacingField";
import TextField from "./fields/TextField";

export function TextBlockEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: TextProps;
  onChange: (props: TextProps) => void;
}) {
  function update(patch: Partial<TextProps>) {
    onChange({ ...props, ...patch });
  }

  return (
    <FieldGroup>
      <TextField
        value={{
          alignment: props.alignment,
          format: props.format,
          color: props.color,
        }}
        business={business}
        onChange={(t) =>
          update({ alignment: t.alignment, format: t.format, color: t.color })
        }
      />

      <BackgroundColorField
        value={props.backgroundColor}
        business={business}
        onChange={(c) => update({ backgroundColor: c })}
      />
      <BorderField
        value={props.border}
        business={business}
        onChange={(b) => update({ border: b })}
      />
      <SpacingField
        label="Padding"
        description="inside"
        accordionValue="padding"
        value={props.padding}
        onChange={(p) => update({ padding: p })}
      />
      <SpacingField
        label="Margin"
        description="outside"
        accordionValue="margin"
        value={props.margin}
        onChange={(m) => update({ margin: m })}
      />
    </FieldGroup>
  );
}
