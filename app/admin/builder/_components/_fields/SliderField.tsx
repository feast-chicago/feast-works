import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export default function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <Field>
      <span className="flex flex-row justify-between">
        <FieldLabel>{label}</FieldLabel>
        <Input
          value={value}
          onChange={(e) =>
            onChange(
              Math.min(
                parseInt(e.target.value.replace(/\D/g, "") || "0", 10),
                max,
              ),
            )
          }
          onBlur={() => onChange(Math.max(value, min))}
          className="w-12! text-center"
        />
      </span>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      />
    </Field>
  );
}
