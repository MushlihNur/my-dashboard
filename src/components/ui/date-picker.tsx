"use client"

import { cn } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { CalendarIcon } from "lucide-react"

interface DatePickerProps {
  label?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = value ? parseISO(value) : undefined
  const today = new Date()
  const currentYear = today.getFullYear()

  function handleSelect(date: Date | undefined) {
    if (!date) return
    onChange?.(format(date, "yyyy-MM-dd"))
    setOpen(false)
  }

  function handleToday() {
    onChange?.(format(today, "yyyy-MM-dd"))
    setOpen(false)
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-medium text-c3">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal bg-white border-c4 text-c3 hover:bg-c1 cursor-pointer w-full",
              !value && "text-slate-400"
            )}
          >
            <CalendarIcon size={16} className="mr-2 text-c2 shrink-0" />
            {value ? format(parseISO(value), "dd MMM yyyy") : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border-c4" align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            captionLayout="dropdown"
            defaultMonth={selected ?? today}
            initialFocus
            startMonth={new Date(currentYear - 100, 0)}
            endMonth={new Date(currentYear + 100, 11)}
            classNames={{
              today: cn(
                "relative font-semibold text-c2",
                "after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2",
                "after:w-1 after:h-1 after:rounded-full after:bg-c2"
              ),
              outside: "text-slate-400 opacity-50 aria-selected:opacity-30",
            }}
          />

          <div className="px-3 pb-3 border-t border-c4 pt-2">
            <button
              onClick={handleToday}
              className="w-full text-xs font-medium text-c2 hover:text-c3 hover:bg-c1 py-1.5 rounded-lg transition cursor-pointer"
            >
              Today — {format(today, "dd MMM yyyy")}
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}