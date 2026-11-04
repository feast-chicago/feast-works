import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toProperCase } from "@/lib/utils";
import { TextFormat, TextFormatSchema } from "@/schema";
import { Bold, Italic, Strikethrough, Underline } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function TextFormatField({
  textFormat,
  setTextFormat,
  patch,
}: {
  textFormat: TextFormat;
  setTextFormat: Dispatch<SetStateAction<TextFormat>>;
  patch: (partial: { textFormat: TextFormat }) => void;
}) {
  return (
    <Field className="w-full max-w-xs flex flex-row gap-5 justify-between">
      <FieldLabel>Format</FieldLabel>
      <ButtonGroup>
        {TextFormatSchema.element.options.map((option) => (
          <Tooltip key={option}>
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                variant={textFormat.includes(option) ? "secondary" : "outline"}
                value={textFormat}
                onClick={() => {
                  const f = option;
                  const newTextFormat: TextFormat = textFormat.includes(f)
                    ? textFormat.filter((el) => el !== f)
                    : [...textFormat, f];

                  setTextFormat(newTextFormat);
                  patch({ textFormat: newTextFormat });
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
