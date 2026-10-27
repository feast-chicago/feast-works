"use client";

import { IS_INLINE_EDITING_ALLOWED } from "@/lib/utils";
import {
  ButtonProps,
  DividerProps,
  HeaderProps,
  ImageProps,
  PageComponent,
  TextProps,
  Theme,
} from "@/schema";
import { ImageOff } from "lucide-react";
import { HTMLAttributeAnchorTarget, useEffect, useRef, useState } from "react";

/**
 * Wraps any text element and makes it inline-editable on double-click.
 * A single-click selects the component, while a double-click enters edit mode.
 */
export function InlineEdit({
  value,
  onChange,
  placeholder = "Click to edit...",
  as: Tag = "p",
  isEditingAllowed = false,
  className = "",
}: {
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span";
  isEditingAllowed?: boolean;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // place cursor at end
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  function handleBlur() {
    setEditing(false);
    if (ref.current) onChange(ref.current.innerText.trim());
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === "Escape") {
      ref.current?.blur();
    }
    // stop dnd-kit from intercepting keyboard events while editing
    e.stopPropagation();
  }

  return (
    <Tag
      ref={ref as any}
      contentEditable={editing}
      suppressContentEditableWarning
      onDoubleClick={(e) => {
        if (isEditingAllowed) {
          e.stopPropagation();
          setEditing(true);
        }
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`w-full px-1 outline-none ring-1 ${!isEditingAllowed ? "ring-transparent cursor-default" : editing ? "ring-primary cursor-text" : "ring-transparent cursor-pointer"} ${!value ? "text-muted-foreground/50 italic" : ""} ${className}`}
      data-placeholder={!value && !editing ? placeholder : undefined}
    >
      {value || (editing ? "" : placeholder)}
    </Tag>
  );
}

/**
 * Gets color details for elements with variant styles.
 */
export function getVariantStyles(
  variant: ButtonProps["variant"],
  theme: Theme | undefined,
  colorOverride?: string,
): React.CSSProperties {
  const primary = theme?.primary_color ?? "oklch(0.205 0 0)";
  const primaryFg = theme?.primary_color_foreground ?? "oklch(0.985 0 0)";
  const secondary = theme?.secondary_color ?? "oklch(0.97 0 0)";
  const secondaryFg = theme?.secondary_color_foreground ?? "oklch(0.205 0 0)";

  switch (variant) {
    case "default":
      return { backgroundColor: primary, color: colorOverride || primaryFg };
    case "secondary":
      return {
        backgroundColor: secondary,
        color: colorOverride || secondaryFg,
      };
    case "outline":
      return {
        backgroundColor: "transparent",
        color: colorOverride || primary,
        border: `1px solid ${primary}`,
      };
    case "ghost":
      return {
        backgroundColor: "transparent",
        color: colorOverride || primary,
      };
    case "destructive":
      return { backgroundColor: "#ef4444", color: "#ffffff" };
    case "link":
      return {
        backgroundColor: "transparent",
        color: colorOverride || primary,
        textDecoration: "underline",
        padding: "0",
      };
    default:
      return { backgroundColor: primary, color: primaryFg };
  }
}

// Blocks
type BlockProps<T> = {
  props: T;
  onChange: (newProps: T) => void;
  theme?: Theme;
};

export function ButtonBlock({
  props,
  onChange,
  theme,
}: BlockProps<ButtonProps>) {
  const { alignment, format, isFullWidth, link, size, variant } = props;

  const alignClass =
    alignment === "center"
      ? "justify-center"
      : alignment === "right"
        ? "justify-end"
        : "justify-start";

  const sizeMap = {
    default: "h-9 px-2.5",
    "extra small": "h-6 px-2",
    small: "h-8 px-2.5",
    large: "h-10 px-2.5",
  };

  const formatClass = format
    ? [
        format.includes("bold") ? "font-bold" : "",
        format.includes("italic") ? "italic" : "",
        format.includes("underline") ? "underline" : "",
        format.includes("strikethrough") ? "line-through" : "",
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const variantStyles = getVariantStyles(
    variant ?? "default",
    theme,
    // color || undefined, // For overriding text color with a color prop
  );

  const linkHref = link
    ? link.type === "site_page"
      ? `/${link.value}`
      : link.type === "external_link"
        ? (link.value ?? "#")
        : link.type === "email"
          ? `mailto:${link.value}`
          : link.type === "phone"
            ? `tel:${link.value}`
            : "#"
    : "#";

  const target: HTMLAttributeAnchorTarget =
    link?.type === "site_page" ? "_self" : "_blank";

  const buttonEl = (
    <span
      role="button"
      style={variantStyles}
      className={`
        group/button inline-flex shrink-0 items-center justify-center rounded-md bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer hover:opacity-80
        ${isFullWidth ? "w-full" : "w-fit"} 
        ${sizeMap[size ?? "default"]}
        ${formatClass}
      `}
    >
      <InlineEdit
        as="span"
        value={props.label}
        onChange={(v) => onChange({ ...props, label: v })}
        placeholder="Button label"
        isEditingAllowed={IS_INLINE_EDITING_ALLOWED}
        className="pointer-events-auto w-full text-center"
      />
    </span>
  );

  return (
    <section
      className={`w-full flex ${alignClass}`}
      style={{
        backgroundColor: props.backgroundColor || undefined,
        border: props.border.width
          ? `${props.border.width}px ${props.border.style.toLowerCase()} ${props.border.color}`
          : undefined,
        margin: `${props.margin.top}px ${props.margin.right}px ${props.margin.bottom}px ${props.margin.left}px`,
        padding: `${props.padding.top}px ${props.padding.right}px ${props.padding.bottom}px ${props.padding.left}px`,
      }}
    >
      {link ? (
        <a
          href={linkHref}
          target={target}
          className={isFullWidth ? "w-full" : "w-fit"}
        >
          {buttonEl}
        </a>
      ) : (
        buttonEl
      )}
    </section>
  );
}

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

export function HeaderBlock({ props, onChange }: BlockProps<HeaderProps>) {
  const {
    alignment,
    backgroundColor,
    body,
    border,
    color,
    format,
    margin,
    padding,
  } = props;
  const alignClass =
    alignment === "center"
      ? "text-center items-center"
      : alignment === "right"
        ? "text-right items-end"
        : alignment === "justify"
          ? "text-justify"
          : "text-left items-start";

  const formatClass = format
    ? `${format.includes("bold") ? "!font-bold" : ""} ${format.includes("italic") ? "!italic" : ""}`
    : "font-normal";

  const sizeMap = {
    h1: "text-5xl",
    h2: "text-4xl",
    h3: "text-3xl",
    h4: "text-2xl",
    h5: "text-xl",
    h6: "text-lg",
  };

  return (
    <section
      className={`flex flex-col gap-4 ${[alignClass, formatClass].filter((c) => c !== "").join(" ")}`}
      style={{
        backgroundColor,
        border: `${border.width}px ${border.style.toLowerCase()} ${border.color}`,
        color,
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        textDecoration: format
          ? `${format.includes("underline") ? "underline" : ""} ${format.includes("strikethrough") ? "line-through" : ""}`
          : "none",
      }}
    >
      {body !== null && (
        <InlineEdit
          as={props.level}
          value={body}
          onChange={(v) => onChange({ ...props, body: v })}
          placeholder="Add a header here..."
          isEditingAllowed={IS_INLINE_EDITING_ALLOWED}
          className={`${sizeMap[props.level ?? "h2"]}`}
        />
      )}
    </section>
  );
}

export function ImageBlock({ props }: BlockProps<ImageProps>) {
  const { alignment, backgroundColor, border, margin, padding } = props;

  const sizeMultiplier = 10;
  const sizePx = props.size * sizeMultiplier;

  const justifyClass =
    alignment === "center"
      ? "justify-center"
      : alignment === "right"
        ? "justify-end"
        : "justify-start";

  const linkHref = props.link
    ? props.link.type === "site_page"
      ? `/${props.link.value}`
      : props.link.type === "external_link"
        ? (props.link.value ?? "#")
        : props.link.type === "email"
          ? `mailto:${props.link.value}`
          : props.link.type === "phone"
            ? `tel:${props.link.value}`
            : undefined
    : undefined;

  const imageEl = (
    <img
      src={props.imageUrl || undefined}
      alt={props.alt}
      style={{ width: sizePx }}
      className={props.isFullWidthOnMobile ? "w-full md:w-auto" : ""}
    />
  );

  return (
    <section
      className={`w-full h-fit flex ${justifyClass}`}
      style={{
        backgroundColor,
        border: `${border.width}px ${border.style.toLowerCase()} ${border.color}`,
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
      }}
    >
      {props.imageUrl ? (
        <div className="flex flex-col items-center gap-2">
          {linkHref ? (
            <a
              href={linkHref}
              target={props.link?.type === "site_page" ? "_self" : "_blank"}
            >
              {imageEl}
            </a>
          ) : (
            imageEl
          )}
          {props.showCaption && props.caption && (
            <p className="text-xs text-muted-foreground">{props.caption}</p>
          )}
        </div>
      ) : (
        <div
          className="flex justify-center items-center bg-muted rounded-lg"
          style={{ width: sizePx, height: sizePx }}
        >
          <ImageOff className="size-1/2 text-muted-foreground" />
        </div>
      )}
    </section>
  );
}

export function TextBlock({ props, onChange }: BlockProps<TextProps>) {
  const {
    alignment,
    backgroundColor,
    body,
    border,
    color,
    format,
    margin,
    padding,
  } = props;
  const alignClass =
    alignment === "center"
      ? "text-center items-center"
      : alignment === "right"
        ? "text-right items-end"
        : alignment === "justify"
          ? "text-justify"
          : "text-left items-start";

  const formatClass = format
    ? `${format.includes("bold") ? "!font-bold" : ""} ${format.includes("italic") ? "!italic" : ""}`
    : "font-normal";

  return (
    <section
      className={`flex flex-col gap-4 ${[alignClass, formatClass].filter((c) => c !== "").join(" ")}`}
      style={{
        backgroundColor,
        border: `${border.width}px ${border.style.toLowerCase()} ${border.color}`,
        color,
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
        textDecoration: format
          ? `${format.includes("underline") ? "underline" : ""} ${format.includes("strikethrough") ? "line-through" : ""}`
          : "none",
      }}
    >
      {body !== null && (
        <InlineEdit
          as="p"
          value={body}
          onChange={(v) => onChange({ ...props, body: v })}
          placeholder="Add text here..."
          isEditingAllowed={IS_INLINE_EDITING_ALLOWED}
          className="text-base"
        />
      )}
    </section>
  );
}

// Block Registry
type AnyBlockProps = {
  props: any;
  onChange: (newProps: any) => void;
  theme?: Theme;
};

export const BLOCK_MAP: Partial<
  Record<PageComponent["type"], React.ComponentType<AnyBlockProps>>
> = {
  button: ButtonBlock,
  divider: DividerBlock,
  header: HeaderBlock,
  image: ImageBlock,
  text: TextBlock,
};
