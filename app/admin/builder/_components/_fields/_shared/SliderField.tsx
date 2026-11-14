import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function SliderField({
  id,
  label,
  value,
  placeholder = "0",
  min,
  max,
  step = 1,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  placeholder?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (raw: string) => void;
}) {
  return (
    <Field>
      <span className="flex flex-row justify-between">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) =>
            onChange(
              String(
                Math.max(
                  min,
                  Math.min(
                    max,
                    parseInt(e.target.value.replace(/\D/g, "") || "0"),
                  ),
                ),
              ),
            )
          }
          onBlur={() => onChange(String(Math.max(min, Math.min(max, value))))}
          className="w-10! text-center"
        />
      </span>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(String(v))}
        min={min}
        max={max}
        step={step}
      />
    </Field>
  );
}
