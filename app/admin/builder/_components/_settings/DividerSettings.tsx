"use client";

import { Business, Divider, DividerSchema } from "@/schema";
import { useState } from "react";
import SelectField from "../_fields/_shared/SelectField";
import SliderField from "../_fields/_shared/SliderField";
import TextColorField from "../_fields/TextColorField";
import SettingsAccordion from "./_shared/SettingsAccordion";

export default function DividerSettings({
  value,
  business,
  onChange,
}: {
  value: Divider;
  business: Business;
  onChange: (props: Divider) => void;
}) {
  const [color, setColor] = useState(value.color ?? "");

  function patch(partial: Partial<Divider>) {
    onChange({ ...value, ...partial });
  }

  return (
    <SettingsAccordion label="Divider" value="divider">
      <SelectField
        id="divider-style"
        label="Style"
        value={value.style}
        options={DividerSchema.shape.style.options}
        onChange={(style) => patch({ style })}
      />

      <SliderField
        id="divider-width"
        label="Thickness"
        value={value.thickness}
        min={1}
        max={10}
        onChange={(thickness) => patch({ thickness: parseInt(thickness) })}
      />

      {value.style !== "blank" && (
        <TextColorField
          business={business}
          color={color}
          setColor={setColor}
          patch={patch}
        />
      )}
    </SettingsAccordion>
  );
}
