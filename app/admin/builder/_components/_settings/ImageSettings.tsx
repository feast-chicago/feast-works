import { uploadImage } from "@/actions/business";
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
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { formatBytes } from "@/lib/utils";
import { AlignmentProps, ImageProps } from "@/schema";
import { FileImage, X } from "lucide-react";
import { startTransition, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import AlignmentField from "../_fields/AlignmentField";
import { LinkField } from "../_fields/LinkField";

const [MIN, MAX, DEFAULT] = [10, 50, 20];

export default function ImageSettings({
  businessId,
  value,
  onChange,
}: {
  businessId: string;
  value: ImageProps;
  onChange: (image: ImageProps) => void;
}) {
  const [image, setImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
      // const localPreview = URL.createObjectURL(file);

      setImage(file);
      setIsUploading(true);
      // setImageUrl(localPreview);

      startTransition(async () => {
        try {
          const { publicUrl } = await uploadImage(file, businessId);

          // Swap local preview for the real URL
          // URL.revokeObjectURL(localPreview);
          setImageUrl(publicUrl);
          patch({ imageUrl: publicUrl });
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Upload failed.");
          setImage(null);
          setImageUrl(null);
          // URL.revokeObjectURL(localPreview);
        } finally {
          setIsUploading(false);
        }
      });
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
            {isUploading ? (
              <div className="w-full min-h-[163.5px] flex flex-col justify-center items-center">
                <Spinner className="size-10 text-secondary" />
                <p className="text-sm text-muted-foreground">
                  Uploading image...
                </p>
              </div>
            ) : image && imageUrl ? (
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

          <AlignmentField
            alignment={alignment}
            setAlignment={setAlignment}
            patch={patch}
            excludeJustify
          />

          <LinkField value={value.link} onChange={(link) => patch({ link })} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
