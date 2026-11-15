import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

export default function SettingsAccordion({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion type="single" collapsible className="rounded-lg border">
      <AccordionItem value={value} className="px-4">
        <AccordionTrigger>{label}</AccordionTrigger>
        <AccordionContent className="h-fit flex flex-col gap-5">
          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
