import { formatRupiah } from "@/lib/format"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  label: string
  amount: number
  variant?: "default" | "positive" | "negative" | "neutral"
}

const variantStyles: Record<string, string> = {
  default: "text-c3",
  positive: "text-green-600",
  negative: "text-red-500",
  neutral: "text-c3",
}

export default function StatsCard({ label, amount, variant = "default" }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-c4 px-5 py-4 flex flex-col gap-1">
      <p className="text-xs text-c2 font-medium uppercase tracking-wide">{label}</p>
      <p className={cn("text-2xl font-semibold", variantStyles[variant])}>
        {formatRupiah(amount)}
      </p>
    </div>
  )
}