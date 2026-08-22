import { CircleX } from "lucide-react";

export default function ErrorIcon({ message }: { message: string }) {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center gap-2">
        <CircleX className="size-20 text-destructive" />
        <p className="font-medium text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
