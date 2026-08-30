"use client";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TextProps } from "@/types/feast";

export default function RichTextEditor({
  props,
  onChange,
}: {
  props: TextProps;
  onChange: (props: TextProps) => void;
}) {
  function update(patch: Partial<TextProps>) {
    onChange({ ...props, ...patch });
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Heading</FieldLabel>
        <Input
          value={props.heading ?? ""}
          onChange={(e) => update({ heading: e.target.value })}
          placeholder="Your heading here"
        />
      </Field>

      <Field>
        <FieldLabel>Heading size</FieldLabel>
        <Select
          value={props.headingSize}
          onValueChange={(v) =>
            update({ headingSize: v as "h1" | "h2" | "h3" })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">H1 — Large</SelectItem>
            <SelectItem value="h2">H2 — Medium</SelectItem>
            <SelectItem value="h3">H3 — Small</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <FieldLabel>Body text</FieldLabel>
        <Textarea
          value={props.body ?? ""}
          onChange={(e) => update({ body: e.target.value })}
          placeholder="Add a paragraph..."
          rows={4}
        />
      </Field>

      {/* <Field>
        <FieldLabel>Button label</FieldLabel>
        <Input
          value={props.button?.label ?? ""}
          onChange={(e) =>
            update({
              button: e.target.value
                ? {
                    ...props.button,
                    label: e.target.value,
                    href: props.button?.href ?? "#",
                    variant: props.button?.variant ?? "primary",
                  }
                : null,
            })
          }
          placeholder="Order now"
        />
      </Field> */}

      {props.button && (
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
      )}

      <Field>
        <FieldLabel>Alignment</FieldLabel>
        <Select
          value={props.alignment}
          onValueChange={(v) => update({ alignment: v as any })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  );
}
