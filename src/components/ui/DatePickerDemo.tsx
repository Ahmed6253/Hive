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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={`w-full border-accent overflow-hidden text-ellipsis bg-transparent hover:bg-transparent justify-between text-left font-normal data-[empty=true]:text-accent ${className}`}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDown />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            setDate(d ?? undefined);
            onChange?.(d ?? undefined);
          }}
          defaultMonth={date}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerDemo;
