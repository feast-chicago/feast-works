import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toProperCase } from "@/lib/utils";

type Option<T extends string> = T | { value: T; label: string };

export default function SelectField<T extends string>({
  id,
  label,
  value,
  placeholder = "Add a value...",
  options,
  onChange,
  adjustOptionLabels = true,
}: {
  id: string;
  label?: string;
  value: T | "";
  placeholder?: string;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  adjustOptionLabels?: boolean;
}) {
  return (
    <Field className="flex flex-row gap-5 justify-between items-center">
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger id={id} className={label ? "w-fit" : "w-full"}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option, i) => {
              const { value, label } =
                typeof option === "string"
                  ? {
                      value: option,
                      label: adjustOptionLabels ? toProperCase(option) : option,
                    }
                  : option;
              return (
                <SelectItem key={i} value={value}>
                  {label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}
