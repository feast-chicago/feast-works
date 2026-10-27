import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toProperCase } from "@/lib/utils";
import { FormatProps, FormatSchema } from "@/schema";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function FormatField({
  format,
  setFormat,
  patch,
}: {
  format: FormatProps;
  setFormat: Dispatch<SetStateAction<FormatProps>>;
  patch: (partial: { format: FormatProps }) => void;
}) {
  return (
    <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
      <FieldLabel>Format</FieldLabel>
      <ButtonGroup>
        {FormatSchema.element.options.map((option) => (
          <Tooltip key={option}>
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                variant={format.includes(option) ? "secondary" : "outline"}
                value={format}
                onClick={() => {
                  const f = option;
                  const newFormat: FormatProps = format.includes(f)
                    ? format.filter((el) => el !== f)
                    : [...format, f];

                  setFormat(newFormat);
                  patch({ format: newFormat });
                }}
              >
                {option === "bold" ? (
                  <Bold />
                ) : option === "italic" ? (
                  <Italic />
                ) : option === "underline" ? (
                  <Underline />
                ) : option === "strikethrough" ? (
                  <Strikethrough />
                ) : (
                  <></>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{toProperCase(option)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </ButtonGroup>
    </Field>
  );
}
