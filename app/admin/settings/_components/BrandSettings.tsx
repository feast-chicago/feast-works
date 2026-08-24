"use client";

import { uploadLogo } from "@/actions/business";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { formatBytes } from "@/lib/utils";
import { Business, GoogleFont, Theme, ThemeSchema } from "@/types/feast";
import { useUser } from "@clerk/nextjs";
import { FileImage, Pencil, Save, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { ChromePicker } from "react-color";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { z } from "zod";
import FontPicker from "./FontPicker";
import SettingsWarningIcon from "./SettingsWarningIcon";

export default function BrandSettings({
  business,
  fonts,
}: {
  business: Business;
  fonts: GoogleFont[];
}) {
  type Radius = z.infer<typeof ThemeSchema.shape.radius>;

  const { theme } = business;
  const {
    primary_logo_url,
    letter_spacing,
    primary_brand_color,
    secondary_brand_color,
    primary_font,
    secondary_font,
    is_dark_mode_enabled,
  } = theme;

  const { user } = useUser();
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(primary_logo_url);

  const [primaryBrandColor, setPrimaryBrandColor] =
    useState(primary_brand_color);
  const [secondaryBrandColor, setSecondaryBrandColor] = useState(
    secondary_brand_color ?? "",
  );
  const [primaryFont, setPrimaryFont] = useState<GoogleFont | null>(
    primary_font ?? null,
  );
  const [secondaryFont, setSecondaryFont] = useState<GoogleFont | null>(
    secondary_font ?? null,
  );
  const [letterSpacing, setLetterSpacing] = useState([letter_spacing]);
  const [padding, setPadding] = useState([theme.padding]);
  const [radius, setRadius] = useState<Radius>(theme.radius);
  const [isDarkModeEnabled, setIsDarkModeEnabled] =
    useState(is_dark_mode_enabled);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;
      setLogo(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setLogoUrl(dataUrl);
      };

      reader.readAsDataURL(file);
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/svg+xml": [".svg"],
      "image/webp": [".webp"],
    },
    multiple: false,
  });

  const handleSubmit = async () => {
    const { id, category } = business;
    const updated_at = new Date();

    await setIsLoading(true);

    if (logo && primaryFont && secondaryFont) {
      const logoPath = `${business.id}/logo-1`;
      await uploadLogo(logo, logoPath)
        .then((image) => {
          const primary_logo_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${image.fullPath}`;

          const theme: Theme = {
            platform_theme: business.theme.platform_theme,
            primary_logo_url,
            secondary_logo_url: null,
            primary_brand_color: primaryBrandColor,
            secondary_brand_color: secondaryBrandColor,
            primary_font: primaryFont,
            secondary_font: secondaryFont,
            letter_spacing: letterSpacing[0],
            padding: padding[0],
            radius,
            is_dark_mode_enabled: isDarkModeEnabled,
          };

          fetch("/api/businesses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify([{ id, theme, updated_at }]),
          });
        })
        .then(() => {
          toast.success(
            `Your ${category.toLowerCase()} has successfully updated.`,
            { position: "bottom-right" },
          );
          setIsEditing(false);
        })
        .catch(() => {
          toast.error(
            `There was an issue updating your ${category.toLowerCase()}. Please try again.`,
            { position: "bottom-right" },
          );
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <Card className="size-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-secondary text-3xl">Brand</CardTitle>
        <CardAction className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="destructive"
                size="icon-sm"
                className="bg-destructive text-destructive-foreground rounded-full"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                <X />
                <span className="sr-only">Cancel</span>
              </Button>
              <Button
                variant="secondary"
                size="icon-sm"
                className="rounded-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Spinner /> : <Save />}
                <span className="sr-only">Save</span>
              </Button>
            </>
          ) : (
            <Button
              size="icon-sm"
              className="rounded-full"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Pencil />
              <span className="sr-only">Edit</span>
            </Button>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        <FieldSet>
          <FieldGroup>
            {/* Logo */}
            <Field>
              <FieldLabel htmlFor="logo">
                Logo <SettingsWarningIcon />
              </FieldLabel>

              {isEditing ? (
                <span className="flex gap-2.5">
                  {/* Logo Preview */}
                  {logo && logoUrl && (
                    <Attachment orientation="vertical">
                      <AttachmentMedia variant="image">
                        <img src={logoUrl} alt={logo.name} />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>{logo.name}</AttachmentTitle>
                        <AttachmentDescription>
                          {logo.type.split("/")[1].split("+")[0].toUpperCase()}{" "}
                          · {formatBytes(logo.size)}
                        </AttachmentDescription>
                      </AttachmentContent>
                      <AttachmentActions>
                        <AttachmentAction
                          aria-label={`Remove ${logo.name}`}
                          onClick={() => setLogo(null)}
                          disabled={!isEditing || isLoading}
                        >
                          <X />
                        </AttachmentAction>
                      </AttachmentActions>
                    </Attachment>
                  )}

                  {/* Logo Upload Dropzone */}
                  <div
                    {...getRootProps()}
                    className={`w-full min-h-[163.5px] flex justify-center items-center group border border-dashed rounded-lg p-5 cursor-pointer transition ${isDragActive ? "border-primary bg-primary/15" : ""} ${
                      !isEditing || isLoading
                        ? "bg-muted text-muted-foreground"
                        : ""
                    }`}
                  >
                    <input
                      {...getInputProps()}
                      disabled={!isEditing || isLoading}
                    />
                    <span
                      className={`flex flex-col justify-center items-center ${
                        !isEditing || isLoading
                          ? "bg-muted text-muted-foreground"
                          : ""
                      }`}
                    >
                      <FileImage className="size-10 mb-2.5" />
                      <p className="text-center text-md font-semibold">
                        Drag & drop your logo or{" "}
                        <span className="text-secondary group-hover:underline">
                          click to browse
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        JPG, JPEG, PNG, or WEBP files
                      </p>
                    </span>
                  </div>
                </span>
              ) : logoUrl ? (
                <Attachment>
                  <AttachmentMedia variant="image">
                    <img src={logoUrl} alt={logoUrl} />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>Your logo</AttachmentTitle>
                    <AttachmentDescription>
                      Looking good, {user ? user.firstName : business.name}!
                    </AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              ) : (
                <Attachment>
                  <AttachmentMedia variant="image">
                    <FileImage />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>No logo uploaded</AttachmentTitle>
                    <AttachmentDescription>
                      Add a logo to make your business stand out.
                    </AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              )}
            </Field>

            {/* Brand colors */}
            <span className="grid max-w-sm grid-cols-2 gap-5">
              {/* Primary brand color */}
              <Field>
                <FieldLabel htmlFor="primary-brand-color">
                  Brand Color 1 <SettingsWarningIcon />
                </FieldLabel>

                <InputGroup
                  className={!isEditing || isLoading ? "bg-muted" : ""}
                >
                  <InputGroupInput
                    id="primary-brand-color"
                    autoComplete="off"
                    placeholder="#ff0000"
                    value={primaryBrandColor}
                    onChange={(e) => setPrimaryBrandColor(e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="disabled:bg-muted"
                  />
                  <InputGroupAddon align="inline-start">
                    <ColorPickerPopover
                      color={primaryBrandColor}
                      setColor={setPrimaryBrandColor}
                      disabled={!isEditing || isLoading}
                    />
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              {/* Secondary brand color */}
              <Field>
                <FieldLabel htmlFor="secondary-brand-color">
                  Brand Color 2 <SettingsWarningIcon />
                </FieldLabel>
                <InputGroup
                  className={!isEditing || isLoading ? "bg-muted" : ""}
                >
                  <InputGroupInput
                    id="secondary-brand-color"
                    autoComplete="off"
                    placeholder="#ff0000"
                    value={secondaryBrandColor ?? ""}
                    onChange={(e) => setSecondaryBrandColor(e.target.value)}
                    disabled={!isEditing || isLoading}
                    className="disabled:bg-muted"
                  />
                  <InputGroupAddon align="inline-start">
                    <ColorPickerPopover
                      color={secondaryBrandColor ?? ""}
                      setColor={setSecondaryBrandColor}
                      disabled={!isEditing || isLoading}
                    />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </span>

            {/* Fonts */}
            <span className="grid max-w-sm grid-cols-2 gap-5">
              {/* Primary font */}
              <Field className="w-full">
                <FieldLabel>Primary Font</FieldLabel>
                <FontPicker
                  fonts={fonts}
                  value={primaryFont}
                  onChange={setPrimaryFont}
                  disabled={!isEditing || isLoading}
                />
              </Field>

              {/* Secondary font */}
              <Field className="w-full">
                <FieldLabel>Secondary Font</FieldLabel>
                <FontPicker
                  fonts={fonts}
                  value={secondaryFont}
                  onChange={setSecondaryFont}
                  disabled={!isEditing || isLoading}
                />
              </Field>
            </span>

            {/* Letter spacing */}
            <Field className="w-full">
              <span className="flex justify-between">
                <FieldLabel>Letter Spacing</FieldLabel>
                <p className="flex items-end text-xs text-muted-foreground">
                  {letterSpacing}em
                </p>
              </span>
              <Slider
                defaultValue={[0]}
                value={letterSpacing}
                onValueChange={setLetterSpacing}
                min={-0.05}
                max={0.05}
                step={0.005}
                disabled={!isEditing || isLoading}
              />
            </Field>

            {/* Padding */}
            <Field className="w-full">
              <span className="flex justify-between">
                <FieldLabel>Padding</FieldLabel>
                <p className="flex items-end text-xs text-muted-foreground">
                  {padding}rem
                </p>
              </span>
              <Slider
                defaultValue={[0.25]}
                value={padding}
                onValueChange={setPadding}
                min={0}
                max={0.5}
                step={0.01}
                disabled={!isEditing || isLoading}
              />
            </Field>

            {/* Radius & Dark mode */}
            <span className="flex gap-5 justify-center items-start">
              {/* Radius */}
              <Field>
                <FieldLabel htmlFor="secondary-brand-color">
                  Corner Radius
                </FieldLabel>
                <Select
                  value={radius}
                  onValueChange={(value) => setRadius(value as typeof radius)}
                  disabled={!isEditing || isLoading}
                >
                  <SelectTrigger
                    className={!isEditing || isLoading ? "bg-muted" : ""}
                  >
                    <SelectValue placeholder="Choose a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {ThemeSchema.shape.radius.options.map((option, i) => (
                      <SelectItem key={i} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {/* Dark mode */}
              <Field>
                <FieldContent className="flex flex-row justify-between items-center">
                  <FieldLabel htmlFor="dark-mode">Dark Mode</FieldLabel>
                  <Switch
                    id="dark-mode"
                    checked={isDarkModeEnabled}
                    onCheckedChange={setIsDarkModeEnabled}
                    disabled={!isEditing || isLoading}
                  />
                </FieldContent>
                <FieldDescription className="text-xs">
                  If enabled, patrons can switch between light and dark mode.
                </FieldDescription>
              </Field>
            </span>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  );
}

function ColorPickerPopover({
  color,
  setColor,
  disabled,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  disabled: boolean;
}) {
  // const [open, setOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroupButton
          className={`size-5 p-0 ml-1.5 hover:scale-105 rounded-md`}
          style={{ backgroundColor: color }}
          disabled={disabled}
        />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 overflow-hidden">
        <ChromePicker
          color={color}
          onChange={(color) => setColor(color.hex)}
          disableAlpha
          className="shadow-none! font-primary!"
        />
      </PopoverContent>
    </Popover>
  );
}
