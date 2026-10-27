import ColorPickerPopover from "@/components/ColorPickerPopover";
import { SeparatorWithText } from "@/components/SeparatorWithText";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Business, HeaderProps } from "@/schema";
import { Dispatch, SetStateAction } from "react";

export default function TextColorField({
  business,
  color,
  setColor,
  patch,
}: {
  business: Business;
  color: HeaderProps["color"];
  setColor: Dispatch<SetStateAction<HeaderProps["color"]>>;
  patch: (partial: { color: HeaderProps["color"] }) => void;
}) {
  const {
    primary_color,
    primary_color_foreground,
    secondary_color,
    secondary_color_foreground,
  } = business.theme;
  return (
    <Field>
      <span className="flex flex-row justify-between gap-7">
        <FieldLabel htmlFor="color">Color</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="color"
            autoComplete="off"
            placeholder="Choose a color..."
            value={color}
            onChange={(e) => {
              setColor(e.target.value);
              patch({ color: e.target.value });
            }}
          />
          <InputGroupAddon align="inline-start">
            <ColorPickerPopover
              color={color}
              setColor={setColor}
              onClick={() => patch({ color })}
            />
          </InputGroupAddon>
        </InputGroup>
      </span>

      <SeparatorWithText text="or" />

      <div className="grid grid-cols-2 gap-4">
        <Button
          size="sm"
          style={{
            backgroundColor: primary_color,
            color: primary_color_foreground,
          }}
          onClick={() => {
            setColor(primary_color);
            patch({ color: primary_color });
          }}
        >
          Primary
        </Button>
        {secondary_color && secondary_color_foreground && (
          <Button
            size="sm"
            style={{
              backgroundColor: secondary_color,
              color: secondary_color_foreground,
            }}
            onClick={() => {
              setColor(secondary_color);
              patch({ color: secondary_color });
            }}
          >
            Secondary
          </Button>
        )}
      </div>
    </Field>
  );
}
