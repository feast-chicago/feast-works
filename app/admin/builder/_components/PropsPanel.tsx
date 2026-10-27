import { Business, PageComponent } from "@/schema";
import { X } from "lucide-react";
import {
  ButtonBlockEditor,
  HeaderBlockEditor,
  ImageBlockEditor,
  TextBlockEditor,
} from "./BlockEditors";

const editors: Partial<
  Record<PageComponent["type"], React.ComponentType<any>>
> = {
  button: ButtonBlockEditor,
  header: HeaderBlockEditor,
  image: ImageBlockEditor,
  text: TextBlockEditor,
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
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {component.type.replace(/_/g, " ")} Settings
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
