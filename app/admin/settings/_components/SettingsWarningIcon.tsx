import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircleAlert } from "lucide-react";

export default function SettingsWarningIcon() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <CircleAlert className="size-4 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        The system needs a quick update to fully apply this change.
      </TooltipContent>
    </Tooltip>
  );
}
