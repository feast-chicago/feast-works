import { Business, PageComponent } from "@/schema";
import { X } from "lucide-react";
import BlockEditor from "./BlockEditor";

const editors: Partial<
  Record<PageComponent["type"], React.ComponentType<any>>
> = {
  text: BlockEditor,
};

interface PropsPanelProps {
  business: Business;
  component: PageComponent;
  onChange: (newProps: Record<string, unknown>) => void;
  onClose: () => void;
}

export default function PropsPanel({
  business,
  component,
  onChange,
  onClose,
}: PropsPanelProps) {
  const Editor = editors[component.type];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium capitalize">
          {component.type.replace(/_/g, " ")} Block Settings
        </p>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      {Editor ? (
        <Editor
          business={business}
          props={component.props}
          onChange={onChange}
        />
      ) : (
        <p className="text-sm text-muted-foreground">
          No settings for this section yet.
        </p>
      )}
    </div>
  );
}
