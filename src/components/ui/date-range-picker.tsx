"use client"

import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "./calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DateRangePickerProps {
  value: DateRange | undefined
  onChange: (range: DateRange | undefined) => void
  className?: string
}

export default function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal bg-white border-c4 text-c3 hover:bg-c1 cursor-pointer",
            !value && "text-slate-400",
            className
          )}
        >
          <CalendarIcon size={16} className="mr-2 text-c2" />
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "dd MMM yyyy")} – {format(value.to, "dd MMM yyyy")}
              </>
            ) : (
              format(value.from, "dd MMM yyyy")
            )
          ) : (
            "Pick a date range"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border-c4" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={1}
          captionLayout="dropdown"
          defaultMonth={value?.from}
          classNames={{
            root: "w-64",
            range_start: "[&_button]:!rounded-r-none",
            range_end: "[&_button]:!rounded-l-none",
            range_middle: "bg-c3/20 rounded-none",
            today: "rounded-inherit",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}