import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  value: string
  valueClassName?: string
  className?: string
  action?: React.ReactNode
}

export default function StatsCard({ label, value, valueClassName, className, action }: StatsCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-c4 px-5 py-4 flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-c2 font-medium uppercase tracking-wide">{label}</p>
        {action && <div>{action}</div>}
      </div>
      <p className={cn("text-2xl font-semibold text-c3", valueClassName)}>
        {value}
      </p>
    </div>
  )
}