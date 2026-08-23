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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { formatBytes } from "@/lib/utils";
import { Business, ThemeSchema } from "@/types/feast";
import { FileImage, Pencil, Save, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import SettingsWarningIcon from "./SettingsWarningIcon";

export default function BrandSettings({ business }: { business: Business }) {
  const { theme } = business;
  const {
    primary_logo_url,
    letter_spacing,
    primary_brand_color,
    secondary_brand_color,
  } = theme;

  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(primary_logo_url);
  const [primaryBrandColor, setPrimaryBrandColor] =
    useState(primary_brand_color);
  const [secondaryBrandColor, setSecondaryBrandColor] = useState(
    secondary_brand_color,
  );
  const [letterSpacing, setLetterSpacing] = useState([letter_spacing]);
  const [padding, setPadding] = useState([theme.padding]);

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
                onClick={() => {}}
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
                        {logo.type.split("/")[1].toUpperCase()} ·{" "}
                        {formatBytes(logo.size)}
                      </AttachmentDescription>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction
                        aria-label={`Remove ${logo.name}`}
                        onClick={() => setLogo(null)}
                      >
                        <X />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                )}

                {/* Logo Upload Dropzone */}
                <div
                  {...getRootProps()}
                  className={`w-full min-h-[163.5px] flex justify-center items-center group border border-dashed rounded-lg p-5 cursor-pointer transition ${isDragActive ? "border-primary bg-primary/15" : ""}`}
                >
                  <input {...getInputProps()} />
                  <span className="flex flex-col justify-center items-center">
                    <FileImage className="size-10 mb-2.5" />
                    <p className="text-center text-md font-semibold">
                      Drag & drop your logo or{" "}
                      <span className="group-hover:underline">
                        click to browse
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, JPEG, PNG, or WEBP files
                    </p>
                  </span>
                </div>
              </span>
            </Field>

            {/* Brand colors */}
            <span className="grid max-w-sm grid-cols-2 gap-5">
              {/* Primary brand color */}
              <Field>
                <FieldLabel htmlFor="primary-brand-color">
                  Brand color 1 <SettingsWarningIcon />
                </FieldLabel>
                <Input
                  id="primary-brand-color"
                  autoComplete="off"
                  placeholder="#ff0000"
                  value={primaryBrandColor}
                  onChange={(e) => setPrimaryBrandColor(e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="disabled:bg-muted"
                />
              </Field>

              {/* Secondary brand color */}
              <Field>
                <FieldLabel htmlFor="secondary-brand-color">
                  Brand color 2 <SettingsWarningIcon />
                </FieldLabel>
                <Input
                  id="secondary-brand-color"
                  autoComplete="off"
                  placeholder="#ff0000"
                  value={secondaryBrandColor ?? ""}
                  onChange={(e) => setSecondaryBrandColor(e.target.value)}
                  disabled={!isEditing || isLoading}
                  className="disabled:bg-muted"
                />
              </Field>
            </span>

            {/* Fonts */}
            <span className="grid max-w-sm grid-cols-2 gap-5">
              {/* Primary font */}
              <Field className="w-full max-w-xs">
                <FieldLabel>Primary font</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="font-1">Font 1</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              {/* Secondary font */}
              <Field className="w-full max-w-xs">
                <FieldLabel>Secondary font</FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="font-1">Font 1</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              />
            </Field>

            {/* Corner radius & Dark mode */}
            <span className="flex gap-5 justify-center items-start">
              <Field>
                <FieldLabel htmlFor="secondary-brand-color">
                  Corner radius
                </FieldLabel>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a font" />
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

              <Field>
                <FieldContent className="flex flex-row justify-between items-center">
                  <FieldLabel htmlFor="dark-mode">Dark mode</FieldLabel>
                  <Switch id="dark-mode" />
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
