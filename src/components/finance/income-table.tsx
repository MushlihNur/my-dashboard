import { formatRupiah } from "@/lib/format"
import { Income } from "@/lib/mock/income"
import { format, parseISO } from "date-fns"
import CategoryBadge from "./category-badge"

export default function IncomeTable({ income }: { income: Income[] }) {
  if (income.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-c2">
        No income recorded in this period.
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
          {income.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b border-c4 last:border-0 hover:bg-slate-50 transition ${
                index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <td className="px-4 py-3 text-c3">{format(parseISO(item.date), "dd MMM yyyy")}</td>
              <td className="px-4 py-3">
                <CategoryBadge category={item.category} />
              </td>
              <td className="px-4 py-3 text-c2">{item.note}</td>
              <td className="px-4 py-3 text-right font-medium text-green-600">
                {formatRupiah(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-50 border-t-2 border-c4">
            <td colSpan={3} className="px-4 py-3 text-sm font-medium text-c3">
              Total ({income.length} transactions)
            </td>
            <td className="px-4 py-3 text-right font-semibold text-green-600">
              {formatRupiah(income.reduce((sum, i) => sum + i.amount, 0))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}