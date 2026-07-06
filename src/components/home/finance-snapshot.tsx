import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth } from "date-fns";
import Link from "next/link";
import StatsCard from "../ui/stats-card";
import { mockExpenses } from "@/lib/mock/expenses";
import { mockIncome } from "@/lib/mock/income";
import { getBudget } from "@/lib/mock/budget";
import { formatRupiah } from "@/lib/format";
import CategoryBadge from "../finance/category-badge";

const today = new Date()
// const today = new Date('2026-06-20T00:00:00')
const monthStart = startOfMonth(today)
const monthEnd = endOfMonth(today)

const thisMonthExpenses = mockExpenses.filter((e) => 
  isWithinInterval(parseISO(e.date), {start: monthStart, end: monthEnd})
)

const thisMonthIncome = mockIncome.filter((i) => 
  isWithinInterval(parseISO(i.date), {start: monthStart, end: monthEnd})
)

const totalIncome = thisMonthIncome.reduce((sum, i) => sum + i.amount, 0)
const totalExpenses = thisMonthExpenses.reduce((sum, i) => sum + i.amount, 0)
const budget = getBudget(today.getFullYear(), today.getMonth() + 1)
const limit = budget?.limit ?? 0
const balance = limit - totalExpenses
const balanceVariant = balance >= 0 ? "text-green-600" : "text-red-500"

const recentExpenses = [...thisMonthExpenses]
  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  .slice(0, 3)

export default function FinanceSnapshot() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-c3">Finance — This Month</h2>
        <Link href="/finance" className="text-xs text-c2 hover:text-c3 transition">
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Income" value={formatRupiah(totalIncome)} valueClassName="text-green-600 text-lg" />
        <StatsCard label="Limit" value={formatRupiah(limit)} valueClassName="text-lg" />
        <StatsCard label="Expenses" value={formatRupiah(totalExpenses)} valueClassName="text-red-500 text-lg" />
        <StatsCard label="Balance" value={formatRupiah(balance)} valueClassName={`${balanceVariant} text-lg`} />
      </div>

      <div className="bg-white rounded-xl border border-c4 overflow-hidden">
        <div className="px-4 py-3 border-b border-c4 flex items-center justify-between">
          <p className="text-xs font-medium text-c3">Recent Transactions</p>
          <Link href="/finance/expenses" className="text-xs text-c2 hover:text-c3 transition">
            View all →
          </Link>
        </div>

        {recentExpenses.length === 0 ? (
          <p className="text-xs text-c2 text-center py-10">No transactions this month.</p>
        ) : (
          <div className="divide-y divide-c4">
            {recentExpenses.map((expense) => (
              <div key={expense.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <CategoryBadge category={expense.category} />
                  <div>
                    <p className="text-xs font-medium text-c3">{expense.note}</p>
                    <p className="text-xs text-slate-400">{format(parseISO(expense.date), "dd MMM yyyy")}</p>
                  </div>
                </div>
                <p className="text-xs font-medium text-red-500">
                  -{formatRupiah(expense.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}