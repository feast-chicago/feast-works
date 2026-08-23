"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GoogleFont } from "@/types/feast";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Tracks which fonts have already been injected into the <head>
const loadedFonts = new Set<string>();
const fontReadyPromises = new Map<string, Promise<void>>();

function loadFont(font: GoogleFont): Promise<void> {
  if (loadedFonts.has(font.family)) return Promise.resolve();
  if (fontReadyPromises.has(font.family))
    return fontReadyPromises.get(font.family)!;

  const weights = font.variants
    .filter((v) => !v.includes("italic") && v !== "regular")
    .map(Number)
    .filter(Boolean)
    .sort((a, b) => a - b);

  if (!weights.includes(400)) weights.unshift(400);

  const family = font.family.replace(/ /g, "+");
  const axes = weights.join(";");
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${axes}&display=block`;

  const promise = new Promise<void>((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.onload = async () => {
      // Wait for the font to actually be ready to paint
      try {
        await document.fonts.load(`400 1em "${font.family}"`);
      } catch {
        // font.load can fail silently — still resolve
      }
      loadedFonts.add(font.family);
      resolve();
    };
    document.head.appendChild(link);
  });

  fontReadyPromises.set(font.family, promise);
  return promise;
}

function FontOption({
  font,
  isSelected,
  onSelect,
}: {
  font: GoogleFont;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [fontReady, setFontReady] = useState(loadedFonts.has(font.family));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fontReady) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          await loadFont(font);
          setFontReady(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [font, fontReady]);

  return (
    <CommandItem value={font.family} onSelect={onSelect}>
      <div ref={ref} className="flex-1 flex items-center min-w-0">
        {fontReady ? (
          <span
            style={{
              fontFamily: `"${font.family}", ${font.category}`,
              fontSize: "1.1rem",
            }}
            className="truncate transition-opacity duration-150 opacity-100"
          >
            {font.family}
          </span>
        ) : (
          // placeholder while loading — same height, no flash
          <span className="truncate text-sm text-muted-foreground">
            {font.family}
          </span>
        )}
      </div>
      {isSelected && <Check className="size-4 shrink-0 ml-2" />}
    </CommandItem>
  );
}

interface FontPickerProps {
  fonts: GoogleFont[];
  value: GoogleFont | null;
  onChange: (font: GoogleFont) => void;
  placeholder?: string;
  disabled: boolean;
}

const TOP_FONTS_COUNT = 25;

export default function FontPicker({
  fonts,
  value,
  onChange,
  placeholder = "Select a font...",
  disabled,
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const filtered = fonts.filter((f) =>
    f.family.toLowerCase().includes(search.toLowerCase()),
  );

  // Preload top fonts on mount so they're ready before the dropdown opens
  useEffect(() => {
    fonts.slice(0, TOP_FONTS_COUNT).forEach((font) => loadFont(font));
  }, [fonts]);

  // Load fonts for visible items using IntersectionObserver
  useEffect(() => {
    if (!open) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const family = (entry.target as HTMLElement).dataset.family;
            const font = fonts.find((f) => f.family === family);
            if (font) loadFont(font);
          }
        });
      },
      { threshold: 0.1 },
    );

    // Observe all font items after they mount
    setTimeout(() => {
      document
        .querySelectorAll("[data-family]")
        .forEach((el) => observerRef.current?.observe(el));
    }, 100);

    return () => observerRef.current?.disconnect();
  }, [open, filtered, fonts]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between font-normal ${disabled ? "bg-muted" : ""}`}
          style={
            value
              ? { fontFamily: `"${value.family}", ${value.category}` }
              : undefined
          }
          disabled={disabled}
        >
          <span
            className="truncate text-sm"
            style={
              value
                ? { fontFamily: `"${value.family}", ${value.category}` }
                : undefined
            }
          >
            {value ? value.family : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search fonts..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>No fonts found.</CommandEmpty>
            <CommandGroup>
              {filtered.map((font) => (
                <FontOption
                  key={font.family}
                  font={font}
                  isSelected={value?.family === font.family}
                  onSelect={() => {
                    onChange(font);
                    setOpen(false);
                  }}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
