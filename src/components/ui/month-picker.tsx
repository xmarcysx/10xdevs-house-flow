import * as React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"

interface MonthPickerProps {
  selected?: Date
  onChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

function MonthPicker({
  selected,
  onChange,
  placeholder = "Wybierz miesiąc",
  className,
  disabled = false,
  ...props
}: MonthPickerProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("relative", className)} {...props}>
      <DatePicker
        selected={selected}
        onChange={onChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        showFullMonthYearPicker
        showTwoColumnMonthYearPicker
        placeholderText={placeholder}
        disabled={disabled}
        withPortal
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "preventOverflow",
            options: {
              boundary: "viewport",
            },
          },
        ]}
        className={cn(
          "flex h-9 w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-800/90 px-3 py-1 text-sm shadow-sm transition-colors focus:border-red-500 dark:focus:border-red-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        )}
        wrapperClassName="w-full"
        calendarClassName="bg-white/95 dark:bg-gray-800/95 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50"
        monthClassName={(date) =>
          cn(
            "hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300",
            date.getMonth() === selected?.getMonth() &&
            date.getFullYear() === selected?.getFullYear() &&
            "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold"
          )
        }
        yearClassName={(date) =>
          cn(
            "hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-300",
            date.getFullYear() === selected?.getFullYear() &&
            "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-semibold"
          )
        }
      />
      <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none opacity-50" />
    </div>
  )
}

export { MonthPicker }
