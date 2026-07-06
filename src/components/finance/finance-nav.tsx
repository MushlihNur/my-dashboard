"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const financeNavItems = [
  { label: "Overview", href: "/finance" },
  { label: "Expenses", href: "/finance/expenses" },
  { label: "Income", href: "/finance/income" },
  { label: "Summary", href: "/finance/summary" },
  { label: "Goals", href: "/finance/goals" },
]

export default function FinanceNav() {
  const pathname = usePathname()

  return (
    <div className="flex gap-1 border-b border-c4 mb-6 overflow-auto scrollbar-none">
      {financeNavItems.map((item) => {
        const isActive = item.href === "/finance"
          ? pathname === "/finance"
          : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "px-4 py-2 text-sm transition border-b-2 -mb-px",
              isActive
                ? "border-c3 text-c3 font-medium"
                : "border-transparent text-c2 hover:text-c3"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}