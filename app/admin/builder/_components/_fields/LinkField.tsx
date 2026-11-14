"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, LinkType, PAGE_KEYS } from "@/schema";
import { Link as LinkIcon, Trash } from "lucide-react";
import { useState } from "react";
import SelectField from "./_shared/SelectField";

const LINK_OPTIONS: {
  value: LinkType;
  label: string;
  description: string;
}[] = [
  {
    value: "site_page",
    label: "Site page",
    description: "Link to a page on this website",
  },
  {
    value: "external_link",
    label: "External link",
    description: "Link to any URL",
  },
  {
    value: "email",
    label: "Email",
    description: "Link to an email address",
  },
  { value: "phone", label: "Phone", description: "Link to a phone number" },
];

export function LinkField({
  value,
  onChange,
}: {
  value: Link;
  onChange: (link: Link) => void;
}) {
  const [open, setOpen] = useState(false);
  const [linkType, setLinkType] = useState<LinkType | null>(
    value?.type ?? null,
  );
  const [draft, setDraft] = useState<string>(value?.value ?? "");

  function handleTypeSelect(type: LinkType) {
    setLinkType(type);
    setDraft(""); // clear previous value when switching types
    setOpen(true);
  }

  function handleSave() {
    if (!linkType) return;
    onChange({ type: linkType, value: draft || null });
    setOpen(false);
  }

  function handleClear() {
    setLinkType(null);
    setDraft("");
    onChange(null);
    setOpen(false);
  }

  const selectedLabel = LINK_OPTIONS.find((o) => o.value === linkType)?.label;

  return (
    <>
      <SelectField
        id="item-link"
        label="Link"
        value={linkType ?? ""}
        placeholder="Add a link"
        options={LINK_OPTIONS}
        onChange={handleTypeSelect}
      />

      {/* Current Link Preview */}
      {value && (
        <span className="flex justify-between items-baseline gap-2">
          <span className="flex items-center gap-2 text-xs text-muted-foreground line-clamp-1">
            <LinkIcon className="size-3" /> {value.value}
          </span>
          <Button variant="destructive" size="icon-xs" onClick={handleClear}>
            <Trash />
          </Button>
        </span>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{selectedLabel}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 pt-2">
            {linkType === "site_page" && (
              <Field>
                <FieldLabel>Page</FieldLabel>
                <Select value={draft} onValueChange={setDraft}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {PAGE_KEYS.map((page) => (
                        <SelectItem key={page} value={page}>
                          <span className="capitalize">{page}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}

            {linkType === "external_link" && (
              <Field>
                <FieldLabel>URL</FieldLabel>
                <Input
                  placeholder="https://..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  type="url"
                />
              </Field>
            )}

            {linkType === "email" && (
              <Field>
                <FieldLabel>Email address</FieldLabel>
                <Input
                  placeholder="hello@example.com"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  type="email"
                />
                <FieldDescription className="text-xs">
                  Clicking the image will open the visitor's email client.
                </FieldDescription>
              </Field>
            )}

            {linkType === "phone" && (
              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <Input
                  placeholder="+1 (773) 555-0100"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  type="tel"
                />
                <FieldDescription className="text-xs">
                  Clicking the image will dial this number on mobile devices.
                </FieldDescription>
              </Field>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="destructive" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={!draft}
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
