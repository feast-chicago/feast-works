import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatBytes, toProperCase } from "@/lib/utils";
import { AlignmentProps, AlignmentSchema, ImageProps } from "@/schema";
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  FileImage,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { LinkField } from "./LinkField";

const [MIN, MAX, DEFAULT] = [10, 50, 20];

export default function ImageField({
  value,
  onChange,
}: {
  value: ImageProps;
  onChange: (image: ImageProps) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(value.imageUrl);
  const [size, setSize] = useState(value.size ?? DEFAULT);
  const [alignment, setAlignment] = useState<AlignmentProps>(
    value.alignment ?? "left",
  );
  const [caption, setCaption] = useState(value.caption ?? "");
  const [showCaption, setShowCaption] = useState(value.showCaption ?? false);
  const [isFullWidthOnMobile, setIsFullWidthOnMobile] = useState(
    value.isFullWidthOnMobile ?? false,
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (!file) return;
      setImage(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        patch({ ...value, imageUrl: dataUrl });
        setImageUrl(dataUrl);
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

  function patch(partial: Partial<ImageProps>) {
    onChange({ ...value, ...partial });
  }

  function handleSizeInput(raw: string) {
    const clean = raw.replace(/\D/g, "");
    const n = Math.min(parseInt(clean || "0"), MAX);
    setSize(n);
    patch({ size: n });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="text" className="px-4">
        <AccordionTrigger>Image</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          {/* Image */}
          <span>
            {image && imageUrl ? (
              // Image Preview
              <Attachment orientation="custom-vertical">
                <AttachmentMedia variant="custom-image">
                  <img src={imageUrl} alt={image.name} />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{image.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {image.type.split("/")[1].split("+")[0].toUpperCase()} ·{" "}
                    {formatBytes(image.size)}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${image.name}`}
                    onClick={() => {
                      setImage(null);
                      setImageUrl(null);
                      patch({ imageUrl: null });
                    }}
                  >
                    <X />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ) : (
              // Image Upload Dropzone
              <div
                {...getRootProps()}
                className={`w-full min-h-[163.5px] flex justify-center items-center group border border-dashed rounded-lg p-5 cursor-pointer transition ${isDragActive ? "border-primary bg-primary/15" : ""}`}
              >
                <input {...getInputProps()} />
                <span className="flex flex-col justify-center items-center">
                  <FileImage className="size-10 mb-2.5" />
                  <p className="text-center text-md font-semibold">
                    Drag & drop your image or{" "}
                    <span className="text-secondary group-hover:underline">
                      click to browse
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, JPEG, PNG, or WEBP files
                  </p>
                </span>
              </div>
            )}
          </span>

          {/* Size */}
          <Field>
            <span className="flex flex-row justify-between">
              <FieldLabel htmlFor="size">Size</FieldLabel>
              <Input
                id="width"
                placeholder="0"
                value={size}
                onChange={(e) => handleSizeInput(e.target.value)}
                className="w-10! text-center"
              />
            </span>
            <Slider
              value={[size]}
              onValueChange={([v]) => {
                setSize(v);
                patch({ size: v });
              }}
              min={MIN}
              max={MAX}
              step={1}
            />
          </Field>

          {/* Switch  */}
          <Field orientation="horizontal" className="max-w-sm">
            <FieldContent>
              <FieldLabel>Full width on mobile</FieldLabel>
              <FieldDescription className="text-xs">
                Display the image at max size on mobile devices.
              </FieldDescription>
            </FieldContent>
            <Switch
              checked={isFullWidthOnMobile}
              onCheckedChange={(checked) => {
                setIsFullWidthOnMobile(checked);
                patch({ isFullWidthOnMobile: checked });
              }}
            />
          </Field>

          {/* Caption */}
          <Field>
            <FieldLabel htmlFor="caption">Caption</FieldLabel>
            <Input
              id="caption"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                patch({ caption: e.target.value });
              }}
            />
          </Field>

          {/* Show Caption */}
          <Field orientation="horizontal">
            <Checkbox
              id="show-caption"
              name="show-caption"
              onCheckedChange={(checked) => {
                const isChecked = checked === true;
                setShowCaption(isChecked);
                patch({ showCaption: isChecked });
              }}
            />
            <Label htmlFor="show-caption">Show caption</Label>
          </Field>

          {/* Alignment */}
          <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
            <FieldLabel>Alignment</FieldLabel>
            <ButtonGroup>
              {AlignmentSchema.options
                .filter((option) => option !== "justify")
                .map((option) => (
                  <Tooltip key={option}>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant={alignment === option ? "secondary" : "outline"}
                        onClick={() => {
                          setAlignment(option);
                          patch({ alignment: option });
                        }}
                      >
                        {option === "left" ? (
                          <AlignStartVertical />
                        ) : option === "center" ? (
                          <AlignCenterVertical />
                        ) : option === "right" ? (
                          <AlignEndVertical />
                        ) : (
                          <></>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{toProperCase(option)} align</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
            </ButtonGroup>
          </Field>

          {/* Link */}
          <LinkField value={value.link} onChange={(link) => patch({ link })} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
