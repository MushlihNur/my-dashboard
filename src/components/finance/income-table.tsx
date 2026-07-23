"use client"

import { formatRupiah } from "@/lib/format"
import { format, parseISO } from "date-fns"
import CategoryBadge from "./category-badge"
import { IncomeWithCategory } from "@/lib/supabase/types-helper"
import { useState } from "react"
import { deleteIncome } from "@/lib/api/income"
import ConfirmDialog from "../ui/confirm-dialog"
import { Pencil, Trash2 } from "lucide-react"
import IncomeFormDialog from "./income-form-dialog"

interface IncomeTableProps {
  income: IncomeWithCategory[]
  onSuccess: () => void
}

export default function IncomeTable({ income, onSuccess }: IncomeTableProps) {
  const [editingIncome, setEditingIncome] = useState<IncomeWithCategory | null>(null)
  const [deletingIncome, setDeletingIncome] = useState<IncomeWithCategory | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDelete() {
    if (!deletingIncome) return
    setDeleteLoading(true)

    try {
      await deleteIncome(deletingIncome.id)
      setDeletingIncome(null)
      onSuccess()
    } catch {
      // handle dengan toast nanti
    } finally {
      setDeleteLoading(false)
    }
  }

  if (income.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-c2">
        No income recorded in this period.
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-c4 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-c4 bg-slate-50">
              <th className="text-left px-4 py-3 text-c2 font-medium">Date</th>
              <th className="text-left px-4 py-3 text-c2 font-medium">Category</th>
              <th className="text-left px-4 py-3 text-c2 font-medium">Description</th>
              <th className="text-right px-4 py-3 text-c2 font-medium">Amount</th>
              <th className="text-right px-4 py-3 text-c2 font-medium">Actions</th>
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
                <td className="px-4 py-3 text-c3 whitespace-nowrap">
                  {format(parseISO(item.date), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={item.categories} />
                </td>
                <td className="px-4 py-3 text-c2">{item.note ?? "—"}</td>
                <td className="px-4 py-3 text-right font-medium text-green-600 whitespace-nowrap">
                  +{formatRupiah(item.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingIncome(item)}
                      className="p-1.5 rounded-lg text-c2 hover:bg-c1 hover:text-c3 transition cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingIncome(item)}
                      className="p-1.5 rounded-lg text-c2 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-c4">
              <td colSpan={4} className="px-4 py-3 text-sm font-medium text-c3">
                Total ({income.length} transactions)
              </td>
              <td className="px-4 py-3 text-right font-semibold text-green-600 whitespace-nowrap">
                +{formatRupiah(income.reduce((sum, i) => sum + i.amount, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {editingIncome && (
        <IncomeFormDialog
          income={editingIncome}
          open={!!editingIncome}
          onClose={() => setEditingIncome(null)}
          onSuccess={() => {
            setEditingIncome(null)
            onSuccess()
          }}
        />
      )}

      <ConfirmDialog
        open={!!deletingIncome}
        title="Delete Income"
        description={`Are you sure you want to delete "${deletingIncome?.note ?? "this income"}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingIncome(null)}
        loading={deleteLoading}
      />
    </>
  )
}