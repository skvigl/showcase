import { Select as SelectShad, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  className?: string;
  onChange?: (selected: string) => void;
}

export const Select: React.FC<SelectProps> = ({ value, options, placeholder, className, onChange }) => {
  return (
    <SelectShad
      value={value ?? ""}
      onValueChange={(newValue) => {
        if (onChange && newValue) {
          onChange(newValue);
        }
      }}
    >
      <SelectTrigger className={`w-60 ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectShad>
  );
};
