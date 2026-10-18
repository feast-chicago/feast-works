"use client";

import { FieldGroup } from "@/components/ui/field";
import { BaseProps, Business, TextProps } from "@/schema";
import BackgroundColorField from "./fields/BackgroundColorField";
import BorderField from "./fields/BorderField";
import SpacingField from "./fields/SpacingField";
import TextField from "./fields/TextField";

type BaseBlockEditorProps<T extends BaseProps> = {
  children: React.ReactNode;
  business: Business;
  props: T;
  onChange: (props: T) => void;
};

export function BaseBlockEditor<T extends BaseProps>({
  children,
  business,
  props,
  onChange,
}: BaseBlockEditorProps<T>) {
  function update(patch: Partial<BaseProps>) {
    onChange({ ...props, ...patch });
  }

  return (
    <FieldGroup>
      {children}
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
    <BaseBlockEditor business={business} props={props} onChange={onChange}>
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
    </BaseBlockEditor>
  );
}
