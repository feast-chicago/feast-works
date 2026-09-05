"use client";

import {
  DividerProps,
  HoursProps,
  MapProps,
  PageComponent,
  TextProps,
} from "@/types/feast";
import { ImageIcon, MapPin, ShoppingBag, Star } from "lucide-react";
import { InlineEdit } from "./InlineEdit";

// ── shared types ────────────────────────────────────────────────────

type BlockProps<T> = {
  props: T;
  onChange: (newProps: T) => void;
};

// ── Text block ──────────────────────────────────────────────────

export function TextBlock({ props, onChange }: BlockProps<TextProps>) {
  const HeadingTag = props.headingSize ?? "h2";
  const alignClass =
    props.alignment === "center"
      ? "text-center items-center"
      : props.alignment === "right"
        ? "text-right items-end"
        : "text-left items-start";

  return (
    <section className={`px-8 py-12 flex flex-col gap-4 ${alignClass}`}>
      {props.heading !== null && (
        <InlineEdit
          as={HeadingTag}
          value={props.heading}
          onChange={(v) => onChange({ ...props, heading: v })}
          placeholder="Add a heading..."
          className="text-2xl font-secondary font-medium text-foreground"
        />
      )}
      {props.body !== null && (
        <InlineEdit
          as="p"
          value={props.body}
          onChange={(v) => onChange({ ...props, body: v })}
          placeholder="Add body text..."
          className="text-base text-muted-foreground leading-relaxed max-w-2xl"
        />
      )}
      {props.button && (
        <div className="mt-2">
          <InlineEdit
            as="span"
            value={props.button.label}
            onChange={(v) =>
              onChange({ ...props, button: { ...props.button!, label: v } })
            }
            placeholder="Button label"
            className="inline-block bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg"
          />
        </div>
      )}
    </section>
  );
}

// ── Menu block ──────────────────────────────────────────────────────

/* export function MenuBlock({ props, onChange }: BlockProps<MenuProps>) {
  const mockItems = [
    {
      name: "Enchiladas Rojas",
      price: "$14",
      desc: "Three corn tortillas, red chile sauce, queso fresco",
    },
    {
      name: "Tacos de Rajas",
      price: "$11",
      desc: "Roasted poblano, crema, corn tortillas",
    },
    {
      name: "Carnitas Plate",
      price: "$16",
      desc: "Slow-braised pork, rice, beans, tortillas",
    },
    {
      name: "Pozole Rojo",
      price: "$13",
      desc: "Hominy, pork shoulder, dried chiles",
    },
  ];

  return (
    <section className="px-8 py-12">
      <InlineEdit
        as="h2"
        value={props.heading}
        onChange={(v) => onChange({ ...props, heading: v })}
        className="text-2xl font-secondary font-medium mb-6"
      />
      <div
        className={
          props.displayStyle === "grid"
            ? "grid grid-cols-2 gap-4"
            : "flex flex-col gap-3"
        }
      >
        {mockItems.map((item) => (
          <div
            key={item.name}
            className="p-4 rounded-lg border border-border bg-card flex justify-between gap-4"
          >
            <div className="flex flex-col gap-1 flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              {props.showDescriptions && (
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              )}
            </div>
            {props.showPrices && (
              <p className="text-sm font-medium text-primary shrink-0">
                {item.price}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        Menu items are pulled from your catalog
      </p>
    </section>
  );
} */

// ── Hours block ─────────────────────────────────────────────────────

export function HoursBlock({ props, onChange }: BlockProps<HoursProps>) {
  const days = [
    { day: "Monday", hours: "11am – 9pm" },
    { day: "Tuesday", hours: "11am – 9pm" },
    { day: "Wednesday", hours: "11am – 9pm" },
    { day: "Thursday", hours: "11am – 9pm" },
    { day: "Friday", hours: "11am – 10pm" },
    { day: "Saturday", hours: "10am – 10pm" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <section className="px-8 py-12">
      <InlineEdit
        as="h2"
        value={props.heading}
        onChange={(v) => onChange({ ...props, heading: v })}
        className="text-2xl font-secondary font-medium mb-6"
      />
      <div className="flex flex-col gap-2 max-w-sm">
        {days.map(({ day, hours }) => (
          <div key={day} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{day}</span>
            <span className="font-medium">{hours}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Hours are managed from your business settings
      </p>
    </section>
  );
}

// ── Gallery block ───────────────────────────────────────────────────

/* export function GalleryBlock({ props, onChange }: BlockProps<GalleryProps>) {
  const count = Math.min(props.columns * 2, 6);
  const colMap = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };

  return (
    <section className="px-8 py-12">
      <InlineEdit
        as="h2"
        value={props.heading}
        onChange={(v) => onChange({ ...props, heading: v })}
        className="text-2xl font-secondary font-medium mb-6"
      />
      <div className={`grid ${colMap[props.columns]} gap-3`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg bg-muted flex items-center justify-center"
          >
            <ImageIcon className="size-6 text-muted-foreground/40" />
          </div>
        ))}
      </div>
    </section>
  );
} */

// ── Testimonials block ──────────────────────────────────────────────

/* export function TestimonialsBlock({
  props,
  onChange,
}: BlockProps<TestimonialsProps>) {
  const mock = [
    {
      quote: "Best pozole I've had outside of Guadalajara.",
      author: "Maria T.",
    },
    { quote: "A Pilsen institution. Go here immediately.", author: "James R." },
  ];

  return (
    <section className="px-8 py-12">
      <InlineEdit
        as="h2"
        value={props.heading}
        onChange={(v) => onChange({ ...props, heading: v })}
        className="text-2xl font-secondary font-medium mb-6"
      />
      <div className="grid grid-cols-2 gap-4">
        {mock.map((t, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-border bg-card flex flex-col gap-3"
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="size-3.5 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground italic">"{t.quote}"</p>
            <p className="text-xs font-medium">— {t.author}</p>
          </div>
        ))}
      </div>
    </section>
  );
} */

// ── Map block ───────────────────────────────────────────────────────

export function MapBlock({ props, onChange }: BlockProps<MapProps>) {
  const heightMap = { sm: "h-40", md: "h-64", lg: "h-96" };

  return (
    <section className="px-8 py-12">
      <InlineEdit
        as="h2"
        value={props.heading}
        onChange={(v) => onChange({ ...props, heading: v })}
        className="text-2xl font-secondary font-medium mb-4"
      />
      <div
        className={`w-full ${heightMap[props.height]} rounded-xl bg-muted flex flex-col items-center justify-center gap-2 border border-border`}
      >
        <MapPin className="size-6 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground">
          Map renders from your business address
        </p>
      </div>
    </section>
  );
}

// ── About block ─────────────────────────────────────────────────────

/* export function AboutBlock({ props, onChange }: BlockProps<AboutProps>) {
  const imageLeft = props.imagePosition === "left";

  return (
    <section className="px-8 py-12">
      <div
        className={`flex gap-8 items-center ${imageLeft ? "flex-row-reverse" : "flex-row"}`}
      >
        <div className="flex-1 flex flex-col gap-4">
          <InlineEdit
            as="h2"
            value={props.heading}
            onChange={(v) => onChange({ ...props, heading: v })}
            className="text-2xl font-secondary font-medium"
          />
          <InlineEdit
            as="p"
            value={props.body}
            onChange={(v) => onChange({ ...props, body: v })}
            placeholder="Tell your story..."
            className="text-sm text-muted-foreground leading-relaxed"
          />
          {props.button && (
            <InlineEdit
              as="span"
              value={props.button.label}
              onChange={(v) =>
                onChange({ ...props, button: { ...props.button!, label: v } })
              }
              className="inline-block bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg w-fit"
            />
          )}
        </div>
        <div className="w-56 h-56 rounded-xl bg-muted shrink-0 flex items-center justify-center">
          <ImageIcon className="size-8 text-muted-foreground/40" />
        </div>
      </div>
    </section>
  );
} */

// ── Catering block ──────────────────────────────────────────────────

/* export function CateringBlock({ props, onChange }: BlockProps<CateringProps>) {
  return (
    <section className="px-8 py-12 bg-muted/30 rounded-xl">
      <div className="flex flex-col gap-4 max-w-lg">
        <InlineEdit
          as="h2"
          value={props.heading}
          onChange={(v) => onChange({ ...props, heading: v })}
          className="text-2xl font-secondary font-medium"
        />
        <InlineEdit
          as="p"
          value={props.body}
          onChange={(v) => onChange({ ...props, body: v })}
          placeholder="Describe your catering offering..."
          className="text-sm text-muted-foreground leading-relaxed"
        />
        {props.button && (
          <InlineEdit
            as="span"
            value={props.button.label}
            onChange={(v) =>
              onChange({ ...props, button: { ...props.button!, label: v } })
            }
            className="inline-block bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-lg w-fit"
          />
        )}
      </div>
    </section>
  );
} */

// ── Shop block ──────────────────────────────────────────────────────

/* export function ShopBlock({ props, onChange }: BlockProps<ShopProps>) {
  const colMap = { 2: "grid-cols-2", 3: "grid-cols-3" };
  const mock = ["Tote Bag", "Hat", "T-Shirt", "Sticker Pack", "Mug", "Hoodie"];

  return (
    <section className="px-8 py-12">
      <InlineEdit
        as="h2"
        value={props.heading}
        onChange={(v) => onChange({ ...props, heading: v })}
        className="text-2xl font-secondary font-medium mb-6"
      />
      <div className={`grid ${colMap[props.columns]} gap-4`}>
        {mock.slice(0, props.columns * 2).map((item) => (
          <div
            key={item}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <div className="aspect-square bg-muted flex items-center justify-center">
              <ShoppingBag className="size-6 text-muted-foreground/40" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium">{item}</p>
              {props.showPrices && (
                <p className="text-sm text-primary font-medium mt-0.5">$24</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} */

// ── Divider block ───────────────────────────────────────────────────

export function DividerBlock({
  props,
}: {
  props: DividerProps;
  onChange: (p: DividerProps) => void;
}) {
  const spacingMap = { sm: "py-4", md: "py-8", lg: "py-16" };

  return (
    <div
      className={`px-8 ${spacingMap[props.spacing]} flex items-center gap-3`}
    >
      {props.style === "line" && <div className="flex-1 h-px bg-border" />}
      {props.style === "dots" && (
        <div className="flex-1 flex items-center justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="size-1.5 rounded-full bg-border" />
          ))}
        </div>
      )}
      {props.style === "blank" && <div className="flex-1" />}
    </div>
  );
}

// ── Block registry ──────────────────────────────────────────────────

type AnyBlockProps = {
  props: any;
  onChange: (newProps: any) => void;
};

export const BLOCK_MAP: Partial<
  Record<PageComponent["type"], React.ComponentType<AnyBlockProps>>
> = {
  text: TextBlock,
  // menu: MenuBlock,
  hours: HoursBlock,
  // gallery: GalleryBlock,
  // testimonials: TestimonialsBlock,
  map: MapBlock,
  // about: AboutBlock,
  // catering: CateringBlock,
  // shop: ShopBlock,
  divider: DividerBlock,
};
