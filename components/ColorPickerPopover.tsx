import { Dispatch, SetStateAction } from "react";
import { ChromePicker } from "react-color";
import { InputGroupButton } from "./ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function ColorPickerPopover({
  color,
  setColor,
  disabled = false,
  onClick,
}: {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
  disabled?: boolean;
  onClick?: () => void;
}) {
  // const [open, setOpen] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <InputGroupButton
          className={`size-5 p-0 ml-1.5 hover:scale-105 rounded-md`}
          style={{ backgroundColor: color }}
          disabled={disabled}
        />
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 overflow-hidden">
        <ChromePicker
          color={color}
          onChange={(color) => {
            setColor(color.hex);
            onClick?.();
          }}
          disableAlpha
          className="shadow-none! font-primary!"
        />
      </PopoverContent>
    </Popover>
  );
}
