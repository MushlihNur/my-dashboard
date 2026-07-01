import { formatRupiah } from "@/lib/format";
import { getBudget } from "@/lib/mock/budget";
import { Expense } from "@/lib/mock/expenses";
import { Income } from "@/lib/mock/income";
import { aggregateByCategory, grandTotal, totalPerMonth } from "@/lib/summary";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

interface SummaryTableProps {
  expenses: Expense[]
  income: Income[]
  year: number
}

function Cell({ amount, className }: { amount: number; className?: string }) {
  return (
    <td className={cn("px-3 py-2 text-right text-xs whitespace-nowrap", className)}>
      {amount > 0 ? formatRupiah(amount) : <span className="text-slate-300">—</span>}
    </td>
  )
}

export default function SummaryTable({ expenses, income, year }: SummaryTableProps) {
  const expenseAgg = aggregateByCategory(expenses, year)
  const incomeAgg = aggregateByCategory(income, year)

  const expenseCategories = Object.keys(expenseAgg)
  const incomeCategories  = Object.keys(incomeAgg)

  const totalExpensePerMonth = totalPerMonth(expenseAgg)
  const totalIncomePerMonth = totalPerMonth(incomeAgg)

  const totalExpenseGrand = grandTotal(totalExpensePerMonth)
  const totalIncomeGrand = grandTotal(totalIncomePerMonth)

  return (
    <div className="bg-white rounded-xl border border-c4 overflow-hidden">
      <div className="overflow-auto max-h-[600px] scrollbar-thin">
        <table className="table-fixed border-separate border-spacing-0 min-w-[1800px] text-sm">
          <colgroup>
            <col className="w-8 md:w-44" />
            {MONTHS.map((_, i) => (
              <col key={i} className="w-10 md:w-36" />
            ))}
            <col className="w-12 md:w-40" />
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 top-0 z-30 bg-slate-50 border-b border-c4 px-3 py-3 text-left text-xs font-medium text-c2">
                Category
              </th>
              {MONTHS.map((m) => (
                <th
                  key={m}
                  className="sticky top-0 z-20 bg-slate-50 border-b border-c4 px-3 py-3 text-right text-xs font-medium text-c2"
                >
                  {m}
                </th>
              ))}
              <th className="sticky right-0 top-0 z-30 bg-slate-50 border-b border-c4 px-3 py-3 text-right text-xs font-medium text-c2">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="sticky left-0 z-20 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-c3 border-b border-c4">
                Income
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <td key={m} className="bg-slate-100 border-b border-c4" />
              ))}
              <td className="sticky right-0 bg-slate-100 border-b border-c4" />
            </tr>

            {incomeCategories.map((cat) => (
              <tr key={cat} className="hover:bg-slate-50 transition">
                <td className="sticky left-0 z-10 bg-white px-3 py-2 text-xs text-c2 border-b border-c4/50">
                  {cat}
                </td>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Cell key={m} amount={incomeAgg[cat][m] ?? 0} className="text-green-600" />
                ))}
                <Cell
                  amount={Object.values(incomeAgg[cat]).reduce((s, v) => s + v, 0)}
                  className="sticky right-0 bg-white text-green-600 font-medium"
                />
              </tr>
            ))}

            <tr>
              <td className="sticky left-0 z-10 bg-green-50 px-3 py-2 font-semibold text-xs text-green-700 border-b-2 border-c4">
                Total Income
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <td key={m} className="px-3 py-2 text-right text-xs font-semibold text-green-700 whitespace-nowrap border-b-2 border-c4">
                  {totalIncomePerMonth[m] ? formatRupiah(totalIncomePerMonth[m]) : <span className="text-slate-300">—</span>}
                </td>
              ))}
              <td className="sticky right-0 bg-green-50 px-3 py-2 text-right text-xs font-semibold text-green-700 border-b-2 border-c4">
                {formatRupiah(totalIncomeGrand)}
              </td>
            </tr>

            <tr>
              <td className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-xs text-c2 border-b border-c4">
                Limit
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const budget = getBudget(year, m)
                return (
                  <td key={m} className="px-3 py-2 text-right text-xs text-c2 whitespace-nowrap w-28 shrink-0 bg-slate-50/50 border-b border-c4">
                    {budget ? formatRupiah(budget.limit) : <span className="text-slate-300">—</span>}
                  </td>
                )
              })}
              <td className="sticky right-0 bg-slate-50 px-3 py-2 text-right text-xs border-b border-c4">—</td>
            </tr>

            <tr>
              <td className="sticky left-0 z-20 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-c3 border-b border-c4">
                Expenses
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <td key={m} className="bg-slate-100 border-b border-c4" />
              ))}
              <td className="sticky right-0 bg-slate-100 border-b border-c4" />
            </tr>

            {expenseCategories.map((cat) => (
              <tr key={cat} className="hover:bg-slate-50/50 transition">
                <td className="sticky left-0 z-10 bg-white px-3 py-2 text-xs text-c2 border-b border-c4/50">
                  {cat}
                </td>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Cell key={m} amount={expenseAgg[cat][m] ?? 0} className="text-c3 border-b border-c4/50" />
                ))}
                <Cell
                  amount={Object.values(expenseAgg[cat]).reduce((s, v) => s + v, 0)}
                  className="sticky right-0 bg-white font-medium"
                />
              </tr>
            ))}

            <tr>
              <td className="sticky left-0 z-10 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 border-b-2 border-c4">
                Total Expenses
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <td key={m} className="px-3 py-2 text-right text-xs font-semibold text-red-600 whitespace-nowrap border-b-2 border-c4">
                  {totalExpensePerMonth[m] ? formatRupiah(totalExpensePerMonth[m]) : <span className="text-slate-300">—</span>}
                </td>
              ))}
              <td className="sticky right-0 bg-red-50 px-3 py-2 text-right text-xs font-semibold text-red-600 border-b-2 border-c4">
                {formatRupiah(totalExpenseGrand)}
              </td>
            </tr>

            <tr>
              <td className="sticky left-0 z-10 bg-slate-50 px-3 py-2 text-xs font-semibold text-c3">
                Net
              </td>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const net = (totalIncomePerMonth[m] ?? 0) - (totalExpensePerMonth[m] ?? 0)
                const hasData = totalIncomePerMonth[m] || totalExpensePerMonth[m]
                return (
                  <td
                    key={m}
                    className={cn(
                      "px-3 py-2 text-right text-xs font-semibold whitespace-nowrap",
                      net >= 0 ? "text-green-600" : "text-red-500"
                    )}
                  >
                    {hasData ? formatRupiah(net) : <span className="text-slate-300 font-normal">—</span>}
                  </td>
                )
              })}
              <td
                className={cn(
                  "sticky right-0 bg-slate-50 px-3 py-2 text-right text-xs font-semibold",
                  totalIncomeGrand - totalExpenseGrand >= 0
                    ? "text-green-600"
                    : "text-red-500"
                )}
              >
                {formatRupiah(totalIncomeGrand - totalExpenseGrand)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}