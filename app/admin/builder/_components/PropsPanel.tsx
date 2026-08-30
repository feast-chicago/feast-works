import { PageComponent } from "@/types/feast";
import { X } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

const editors: Partial<
  Record<PageComponent["type"], React.ComponentType<any>>
> = {
  text: RichTextEditor,
};

interface PropsPanelProps {
  component: PageComponent;
  onChange: (newProps: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function PropsPanel({
  component,
  onChange,
  onClose,
}: PropsPanelProps) {
  const Editor = editors[component.type];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium capitalize">
          {component.type.replace(/_/g, " ")}
        </p>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      {Editor ? (
        <Editor props={component.props} onChange={onChange} />
      ) : (
        <p className="text-sm text-muted-foreground">
          No settings for this section yet.
        </p>
      )}
    </div>
  );
}
