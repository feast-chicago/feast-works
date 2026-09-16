import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function SeparatorWithText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span
          className={cn("bg-background px-2 text-muted-foreground", className)}
        >
          {text}
        </span>
      </div>
    </div>
  );
}
