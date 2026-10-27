import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Business, TextProps } from "@/schema";
import { useState } from "react";
import AlignmentField from "../_fields/AlignmentField";
import FormatField from "../_fields/FormatField";
import TextColorField from "../_fields/TextColorField";

export default function TextSettings({
  value,
  business,
  onChange,
}: {
  value: TextProps;
  business: Business;
  onChange: (text: TextProps) => void;
}) {
  const [alignment, setAlignment] = useState<TextProps["alignment"]>(
    value.alignment ?? "left",
  );
  const [format, setFormat] = useState<TextProps["format"]>(value.format ?? []);
  const [color, setColor] = useState<TextProps["color"]>(value.color ?? "");

  function patch(partial: Partial<TextProps>) {
    onChange({ ...value, ...partial });
  }

  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value="text" className="px-4">
        <AccordionTrigger>Text</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          <AlignmentField
            alignment={alignment}
            setAlignment={setAlignment}
            patch={patch}
            isText
          />

          <FormatField format={format} setFormat={setFormat} patch={patch} />

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
