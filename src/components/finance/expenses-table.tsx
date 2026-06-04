import { formatRupiah } from "@/lib/format"
import { Expense } from "@/lib/mock/expenses"
import CategoryBadge from "./category-badge"
import { format, parseISO } from "date-fns"

export default function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-c2">
        No transactions this month.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-c4 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-c4 bg-slate-50">
            <th className="text-left px-4 py-3 text-c2 font-medium">Date</th>
            <th className="text-left px-4 py-3 text-c2 font-medium">Category</th>
            <th className="text-left px-4 py-3 text-c2 font-medium">Description</th>
            <th className="text-right px-4 py-3 text-c2 font-medium">Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              key={expense.id}
              className={`border-b border-c4 last:border-0 hover:bg-slate-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <td className="px-4 py-3 text-c3">{format(parseISO(expense.date), "dd MMM yyyy")}</td>
              <td className="px-4 py-3">
                <CategoryBadge category={expense.category} />
              </td>
              <td className="px-4 py-3 text-c2">{expense.note}</td>
              <td className="px-4 py-3 text-right font-medium text-c3">
                {formatRupiah(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-50 border-t-2 border-c4">
            <td colSpan={3} className="px-4 py-3 text-sm font-medium text-c3">
              Total ({expenses.length} transactions)
            </td>
            <td className="px-4 py-3 text-right font-semibold text-c3">
              {formatRupiah(expenses.reduce((sum, e) => sum + e.amount, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}