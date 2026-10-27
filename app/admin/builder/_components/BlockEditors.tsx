"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  BaseProps,
  Business,
  ButtonProps,
  HeaderProps,
  ImageProps,
  TextProps,
} from "@/schema";
import BackgroundColorSettings from "./_settings/_shared/BackgroundColorSettings";
import BorderSettings from "./_settings/_shared/BorderSettings";
import SpacingSettings from "./_settings/_shared/SpacingSettings";
import ButtonSettings from "./_settings/ButtonSettings";
import HeaderSettings from "./_settings/HeaderSettings";
import ImageSettings from "./_settings/ImageSettings";
import TextSettings from "./_settings/TextSettings";

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
    <FieldGroup className="h-full overflow-y-scroll">
      {children}
      <BackgroundColorSettings
        value={props.backgroundColor}
        business={business}
        onChange={(c) => update({ backgroundColor: c })}
      />
      <BorderSettings
        value={props.border}
        business={business}
        onChange={(b) => update({ border: b })}
      />
      <SpacingSettings
        label="Padding"
        description="inside"
        accordionValue="padding"
        value={props.padding}
        onChange={(p) => update({ padding: p })}
      />
      <SpacingSettings
        label="Margin"
        description="outside"
        accordionValue="margin"
        value={props.margin}
        onChange={(m) => update({ margin: m })}
      />
    </FieldGroup>
  );
}

export function ButtonBlockEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: ButtonProps;
  onChange: (props: ButtonProps) => void;
}) {
  function update(patch: Partial<ButtonProps>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseBlockEditor business={business} props={props} onChange={onChange}>
      <ButtonSettings
        value={props}
        // business={business}
        onChange={(h) => update(h)}
      />
    </BaseBlockEditor>
  );
}

export function HeaderBlockEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: HeaderProps;
  onChange: (props: HeaderProps) => void;
}) {
  function update(patch: Partial<HeaderProps>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseBlockEditor business={business} props={props} onChange={onChange}>
      <HeaderSettings
        value={props}
        business={business}
        onChange={(h) => update(h)}
      />
    </BaseBlockEditor>
  );
}

export function ImageBlockEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: ImageProps;
  onChange: (props: ImageProps) => void;
}) {
  function update(patch: Partial<ImageProps>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseBlockEditor business={business} props={props} onChange={onChange}>
      <ImageSettings
        businessId={business.id}
        value={props}
        onChange={(i) => update(i)}
      />
    </BaseBlockEditor>
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
      <TextSettings
        value={props}
        business={business}
        onChange={(t) =>
          update({ alignment: t.alignment, format: t.format, color: t.color })
        }
      />
    </BaseBlockEditor>
  );
}
