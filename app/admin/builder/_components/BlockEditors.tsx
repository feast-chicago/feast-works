"use client";

import { FieldGroup } from "@/components/ui/field";
import {
  BaseProps,
  Business,
  Button,
  Divider,
  Header,
  Image,
  Text,
} from "@/schema";
import BackgroundColorSettings from "./_settings/_shared/BackgroundColorSettings";
import BorderSettings from "./_settings/_shared/BorderSettings";
import SpacingSettings from "./_settings/_shared/SpacingSettings";
import ButtonSettings from "./_settings/ButtonSettings";
import DividerSettings from "./_settings/DividerSettings";
import HeaderSettings from "./_settings/HeaderSettings";
import ImageSettings from "./_settings/ImageSettings";
import TextSettings from "./_settings/TextSettings";

type BaseEditorProps<T extends BaseProps> = {
  children: React.ReactNode;
  business: Business;
  props: T;
  onChange: (props: T) => void;
};

export function BaseEditor<T extends BaseProps>({
  children,
  business,
  props,
  onChange,
}: BaseEditorProps<T>) {
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

export function ButtonEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: Button;
  onChange: (props: Button) => void;
}) {
  function update(patch: Partial<Button>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseEditor business={business} props={props} onChange={onChange}>
      <ButtonSettings
        value={props}
        // business={business}
        onChange={(h) => update(h)}
      />
    </BaseEditor>
  );
}

export function DividerEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: Divider;
  onChange: (props: Divider) => void;
}) {
  function update(patch: Partial<Divider>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseEditor business={business} props={props} onChange={onChange}>
      <DividerSettings
        value={props}
        business={business}
        onChange={(h) => update(h)}
      />
    </BaseEditor>
  );
}

export function HeaderEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: Header;
  onChange: (props: Header) => void;
}) {
  function update(patch: Partial<Header>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseEditor business={business} props={props} onChange={onChange}>
      <HeaderSettings
        value={props}
        business={business}
        onChange={(h) => update(h)}
      />
    </BaseEditor>
  );
}

export function ImageEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: Image;
  onChange: (props: Image) => void;
}) {
  function update(patch: Partial<Image>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseEditor business={business} props={props} onChange={onChange}>
      <ImageSettings
        businessId={business.id}
        value={props}
        onChange={(i) => update(i)}
      />
    </BaseEditor>
  );
}

export function TextEditor({
  business,
  props,
  onChange,
}: {
  business: Business;
  props: Text;
  onChange: (props: Text) => void;
}) {
  function update(patch: Partial<Text>) {
    onChange({ ...props, ...patch });
  }

  return (
    <BaseEditor business={business} props={props} onChange={onChange}>
      <TextSettings
        value={props}
        business={business}
        onChange={(t) =>
          update({
            alignment: t.alignment,
            textFormat: t.textFormat,
            color: t.color,
          })
        }
      />
    </BaseEditor>
  );
}
