import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Business, Header, HeadingLevelSchema } from "@/schema";
import { useState } from "react";
import AlignmentField from "../_fields/AlignmentField";
import TextColorField from "../_fields/TextColorField";
import FormatField from "../_fields/TextFormatField";

const HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;
type HeadingLevel = (typeof HEADING_LEVELS)[number];

export default function HeaderSettings({
  value,
  business,
  onChange,
}: {
  value: Header;
  business: Business;
  onChange: (header: Header) => void;
}) {
  const [level, setLevel] = useState<HeadingLevel>(value.level ?? "h2");
  const [alignment, setAlignment] = useState<Header["alignment"]>(
    value.alignment ?? "left",
  );
  const [textFormat, setTextFormat] = useState<Header["textFormat"]>(
    value.textFormat ?? [],
  );
  const [color, setColor] = useState<Header["color"]>(value.color ?? "");

  function patch(partial: Partial<Header>) {
    onChange({ ...value, ...partial });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="Header" className="px-4">
        <AccordionTrigger>Header</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          {/* Heading */}
          <Field className="w-full flex flex-row gap-5 justify-between items-center">
            <FieldLabel>Size</FieldLabel>
            <Select
              value={level}
              onValueChange={(level: Header["level"]) => {
                setLevel(level);
                patch({ level });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {HeadingLevelSchema.options.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <AlignmentField
            alignment={alignment}
            setAlignment={setAlignment}
            patch={patch}
            isText
          />

          <FormatField
            textFormat={textFormat}
            setTextFormat={setTextFormat}
            patch={patch}
          />

          <TextColorField
            business={business}
            color={color}
            setColor={setColor}
            patch={patch}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
