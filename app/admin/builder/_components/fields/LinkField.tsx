"use client";

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
  Select as SelectPage,
  SelectContent as SelectPageContent,
  SelectGroup as SelectPageGroup,
  SelectItem as SelectPageItem,
  SelectTrigger as SelectPageTrigger,
  SelectValue as SelectPageValue,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LinkProps, LinkTypeProps, PAGE_KEYS } from "@/schema";
import { useState } from "react";

const LINK_OPTIONS: {
  value: LinkTypeProps;
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
  value: LinkProps;
  onChange: (link: LinkProps) => void;
}) {
  const [open, setOpen] = useState(false);
  const [linkType, setLinkType] = useState<LinkTypeProps | null>(
    value?.type ?? null,
  );
  const [draft, setDraft] = useState<string>(value?.value ?? "");

  function handleTypeSelect(type: LinkTypeProps) {
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
      <Field className="w-full flex flex-row gap-5 justify-between items-center">
        <FieldLabel>Link</FieldLabel>
        <div className="flex items-center gap-2">
          {value && (
            <button
              onClick={handleClear}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Remove
            </button>
          )}
          <Select
            value={linkType ?? ""}
            onValueChange={(v) => handleTypeSelect(v as LinkTypeProps)}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Add a link" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {LINK_OPTIONS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Field>

      {/* current link preview */}
      {value?.value && (
        <p className="text-xs text-muted-foreground truncate">
          → {value.value}
        </p>
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
                <SelectPage value={draft} onValueChange={setDraft}>
                  <SelectPageTrigger>
                    <SelectPageValue placeholder="Choose a page" />
                  </SelectPageTrigger>
                  <SelectPageContent>
                    <SelectPageGroup>
                      {PAGE_KEYS.map((page) => (
                        <SelectPageItem key={page} value={page}>
                          <span className="capitalize">{page}</span>
                        </SelectPageItem>
                      ))}
                    </SelectPageGroup>
                  </SelectPageContent>
                </SelectPage>
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
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!draft}
                className="text-sm font-medium text-primary disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
