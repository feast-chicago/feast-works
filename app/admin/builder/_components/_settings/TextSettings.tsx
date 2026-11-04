import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Business, Text } from "@/schema";
import { useState } from "react";
import AlignmentField from "../_fields/AlignmentField";
import TextColorField from "../_fields/TextColorField";
import FormatField from "../_fields/TextFormatField";

export default function TextSettings({
  value,
  business,
  onChange,
}: {
  value: Text;
  business: Business;
  onChange: (text: Text) => void;
}) {
  const [alignment, setAlignment] = useState<Text["alignment"]>(
    value.alignment ?? "left",
  );
  const [textFormat, setTextFormat] = useState<Text["textFormat"]>(
    value.textFormat ?? [],
  );
  const [color, setColor] = useState<Text["color"]>(value.color ?? "");

  function patch(partial: Partial<Text>) {
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
