import Link from "next/link";
import CategoryBadge from "./category-badge";
import { formatRupiah } from "@/lib/format";
import { format, parseISO } from "date-fns";
import { ExpenseWithCategory } from "@/lib/supabase/types-helper";

interface RecentTransactionsProps {
  expenses: ExpenseWithCategory[]
}

export default function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const recent = [...expenses]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 5)

  return (
    <div className="bg-white rounded-xl border border-c4 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-c4">
        <h3 className="text-sm font-medium text-c3">Recent Transactions</h3>
        <Link href="/finance/expenses" className="text-xs text-c2 hover:text-c3 transition">
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div className="text-center py-10 text-sm text-c2">
          No transactions this month.
        </div>
      ) : (
        <div className="divide-y divide-c4">
          {recent.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between px-5 py-3">
              <div className="flex items-center gap-3">
                <CategoryBadge category={expense.categories} />
                <div>
                  <p className="text-sm text-c3">{expense.note}</p>
                  <p className="text-xs text-c2">{format(parseISO(expense.date), "dd MMM yyyy")}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-red-500">
                -{formatRupiah(expense.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}