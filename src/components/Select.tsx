import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Option = { value: string; label: React.ReactNode };

export default function SimpleSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
  size = "default",
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Option[];
  placeholder?: string;
  size?: "sm" | "default";
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger
        size={size}
        className={"border-accent cursor-pointer " + className}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={String(o.value)} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
