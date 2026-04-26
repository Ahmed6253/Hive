import { format } from "date-fns";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

function isValidDate(date?: Date): date is Date {
  return !!date && !Number.isNaN(date.getTime());
}

export function DatePickerDemo({
  value,
  onChange,
  className,
}: {
  value?: Date;
  onChange?: (date?: Date) => void;
  className?: string;
}) {
  const [date, setDate] = useState<Date | undefined>(value);

  useEffect(() => setDate(value), [value]);

  const safeDate = isValidDate(date) ? date : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!safeDate}
          className={`w-full border-accent overflow-hidden text-ellipsis bg-transparent hover:bg-transparent justify-between text-left font-normal data-[empty=true]:text-accent ${className}`}
        >
          {safeDate ? format(safeDate, "PPP") : <span>Pick a date</span>}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={safeDate}
          onSelect={(d) => {
            setDate(d ?? undefined);
            onChange?.(d ?? undefined);
          }}
          defaultMonth={safeDate}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerDemo;
