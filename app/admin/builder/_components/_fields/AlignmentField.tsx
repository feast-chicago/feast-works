import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toProperCase } from "@/lib/utils";
import { AlignmentProps, AlignmentSchema } from "@/schema";
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartVertical,
  Fullscreen,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export default function AlignmentField({
  alignment,
  setAlignment,
  isFullWidth,
  setIsFullWidth,
  patch,
  excludeJustify = false,
  isButton = false,
  isText = false,
}: {
  alignment: AlignmentProps;
  setAlignment: Dispatch<SetStateAction<AlignmentProps>>;
  isFullWidth?: boolean;
  setIsFullWidth?: Dispatch<SetStateAction<boolean>>;
  patch: (partial: { alignment: AlignmentProps; isFullWidth: boolean }) => void;
  excludeJustify?: boolean;
  isButton?: boolean;
  isText?: boolean;
}) {
  return (
    <Field className="w-full flex flex-row gap-5 justify-between items-center">
      <FieldLabel>{isButton ? "Position" : "Alignment"}</FieldLabel>
      <ButtonGroup>
        {AlignmentSchema.options
          .filter((option) => (excludeJustify ? option !== "justify" : option))
          .map((option) => (
            <Tooltip key={option}>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  variant={
                    alignment === option && !isFullWidth
                      ? "secondary"
                      : "outline"
                  }
                  onClick={() => {
                    setAlignment(option);
                    setIsFullWidth?.(false);
                    patch({ alignment: option, isFullWidth: false });
                  }}
                >
                  {option === "left" ? (
                    isText ? (
                      <TextAlignStart />
                    ) : (
                      <AlignStartVertical />
                    )
                  ) : option === "center" ? (
                    isText ? (
                      <TextAlignCenter />
                    ) : (
                      <AlignCenterVertical />
                    )
                  ) : option === "right" ? (
                    isText ? (
                      <TextAlignEnd />
                    ) : (
                      <AlignEndVertical />
                    )
                  ) : (
                    <TextAlignJustify />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{toProperCase(option)} align</p>
              </TooltipContent>
            </Tooltip>
          ))}

        {isButton && setIsFullWidth && (
          <Tooltip key="isFullWidth">
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                variant={isFullWidth ? "secondary" : "outline"}
                onClick={() => {
                  setIsFullWidth(true);
                  patch({ alignment, isFullWidth: Boolean(isFullWidth) });
                }}
              >
                <Fullscreen />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Full width</p>
            </TooltipContent>
          </Tooltip>
        )}
      </ButtonGroup>
    </Field>
  );
}
