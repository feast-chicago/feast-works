import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleAlert } from "lucide-react";

export default function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleAlert className="size-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
