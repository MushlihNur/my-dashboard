"use client"

import { formatRupiah } from "@/lib/format"
import CategoryBadge from "./category-badge"
import { format, parseISO } from "date-fns"
import { ExpenseWithCategory } from "@/lib/supabase/types-helper"
import { useState } from "react"
import { deleteExpense } from "@/lib/api/expenses"
import ExpenseFormDialog from "./expense-form-dialog"
import { Pencil, Trash2 } from "lucide-react"
import ConfirmDialog from "../ui/confirm-dialog"

interface ExpensesTableProps {
  expenses: ExpenseWithCategory[]
  onSuccess: () => void
}

export default function ExpensesTable({ expenses, onSuccess }: ExpensesTableProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  const [deletingExpense, setDeletingExpense] = useState<ExpenseWithCategory | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  async function handleDelete() {
    if (!deletingExpense) return
    setDeleteLoading(true)

    try {
      await deleteExpense(deletingExpense.id)
      setDeletingExpense(null)
      onSuccess()
    } catch {
      // handle error
    } finally {
      setDeleteLoading(false)
    }
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-c2">
        No transactions this period.
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
            {expenses.map((expense, index) => (
              <tr
                key={expense.id}
                className={`border-b border-c4 last:border-0 hover:bg-slate-50 transition ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <td className="px-4 py-3 text-c3 whitespace-nowrap">
                  {format(parseISO(expense.date), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={expense.categories} />
                </td>
                <td className="px-4 py-3 text-c2">{expense.note ?? "—"}</td>
                <td className="px-4 py-3 text-right font-medium text-c3 whitespace-nowrap">
                  {formatRupiah(expense.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingExpense(expense)}
                      className="p-1.5 rounded-lg text-c2 hover:bg-c1 hover:text-c3 transition cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingExpense(expense)}
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
                Total ({expenses.length} transactions)
              </td>
              <td className="px-4 py-3 text-right font-semibold text-c3 whitespace-nowrap">
                {formatRupiah(expenses.reduce((sum, e) => sum + e.amount, 0))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Edit Dialog */}
      {editingExpense && (
        <ExpenseFormDialog
          expense={editingExpense}
          open={!!editingExpense}
          onClose={() => setEditingExpense(null)}
          onSuccess={() => {
            setEditingExpense(null)
            onSuccess()
          }}
        />
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog 
        open={!!deletingExpense}
        title="Delete Transaction"
        description={`Are you sure you want to delete "${deletingExpense?.note ?? "this transaction"}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingExpense(null)}
        loading={deleteLoading}
      />
    </>
  )
}