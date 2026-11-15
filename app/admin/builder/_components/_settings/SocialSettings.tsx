import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Business,
  Social,
  SOCIAL_PLATFORMS,
  SocialLink,
  SocialPlatform,
  SocialPlatformSchema,
  SocialSchema,
} from "@/schema";
import { Trash } from "lucide-react";
import { useState } from "react";
import SelectField from "../_fields/_shared/SelectField";
import SliderField from "../_fields/_shared/SliderField";
import AlignmentField from "../_fields/AlignmentField";
import SettingsAccordion from "./_shared/SettingsAccordion";

export default function SocialSettings({
  value,
  business,
  onChange,
}: {
  value: Social;
  business: Business;
  onChange: (props: Social) => void;
}) {
  const [alignment, setAlignment] = useState<Social["alignment"]>(
    value.alignment ?? "left",
  );

  function patch(partial: Partial<Social>) {
    onChange({ ...value, ...partial });
  }
  function addLink(platform: SocialPlatform) {
    patch({
      links: [...value.links, { id: crypto.randomUUID(), platform, value: "" }],
    });
  }
  function updateLink(id: string, partial: Partial<SocialLink>) {
    patch({
      links: value.links.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    });
  }
  function removeLink(id: string) {
    patch({ links: value.links.filter((l) => l.id !== id) });
  }

  const platformItems = SocialPlatformSchema.options.map((p) => (
    <SelectItem key={p} value={p}>
      {SOCIAL_PLATFORMS[p].label}
    </SelectItem>
  ));

  return (
    <SettingsAccordion label="Social Media" value="social">
      {/* Links */}
      <div className="flex flex-col gap-3">
        {value.links.map((link) => (
          <div
            key={link.id}
            className="flex flex-col gap-2 rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              <Select
                value={link.platform}
                onValueChange={(p) => {
                  updateLink(link.id, { platform: p as SocialPlatform });
                }}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>{platformItems}</SelectGroup>
                </SelectContent>
              </Select>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Remove link"
                onClick={() => removeLink(link.id)}
              >
                <Trash />
              </Button>
            </div>
            <Input
              placeholder={SOCIAL_PLATFORMS[link.platform].placeholder}
              value={link.value}
              onChange={(e) => updateLink(link.id, { value: e.target.value })}
            />
          </div>
        ))}

        <SelectField
          id="social-add-platform"
          value="" // value="" keeps it showing the placeholder after every pick
          placeholder="Add platform"
          options={SocialPlatformSchema.options}
          onChange={addLink}
          adjustOptionLabels={false}
        />
      </div>

      <SelectField
        id="social-variant"
        label="Style"
        value={value.variant}
        placeholder="Display type"
        options={SocialSchema.shape.variant.options}
        onChange={(variant) => patch({ variant })}
      />

      <SelectField
        id="social-display"
        label="Show"
        value={value.display}
        placeholder="Display type"
        options={SocialSchema.shape.display.options}
        onChange={(display) => patch({ display })}
      />

      <SelectField
        id="social-shape"
        label="Shape"
        value={value.shape}
        placeholder="Display type"
        options={SocialSchema.shape.shape.options}
        onChange={(shape) => patch({ shape })}
      />

      <SelectField
        id="social-size"
        label="Size"
        value={value.size}
        placeholder="Display type"
        options={SocialSchema.shape.size.options}
        onChange={(size) => patch({ size })}
      />

      <SelectField
        id="social-layout"
        label="Layout"
        value={value.layout}
        placeholder="Display type"
        options={SocialSchema.shape.layout.options}
        onChange={(layout) => patch({ layout })}
      />

      <SliderField
        id="social-gap"
        label="Spacing"
        value={value.gap}
        min={0}
        max={50}
        onChange={(gap) => patch({ gap: parseInt(gap) })}
      />

      <AlignmentField
        alignment={alignment}
        setAlignment={setAlignment}
        patch={patch}
        excludeJustify
      />
    </SettingsAccordion>
  );
}
