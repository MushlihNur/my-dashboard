"use client"

import { getCategoriesByType } from "@/lib/api/categories"
import { addExpense, updateExpense } from "@/lib/api/expenses"
import { Category, ExpenseWithCategory } from "@/lib/supabase/types-helper"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import FormInput from "../ui/form-input"
import DatePicker from "../ui/date-picker"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { format } from "date-fns"

interface ExpenseFormDialogProps {
  expense?: ExpenseWithCategory
  open?: boolean
  onClose?: () => void
  onSuccess: () => void
}

export default function ExpenseFormDialog({
  expense,
  open: controlledOpen,
  onClose,
  onSuccess,
}: ExpenseFormDialogProps) {
  const isEdit = !!expense

  const [internalOpen, setInternalOpen] = useState(false)
  const open = isEdit ? (controlledOpen ?? false) : internalOpen

  const [categoryId, setCategoryId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [note,setNote] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch categories + populate form when open dialog
  useEffect(() => {
    if (open) {
      getCategoriesByType("expense").then(setCategories)

      if (expense) {
        setCategoryId(expense.category_id)
        setAmount(String(expense.amount))
        setDate(expense.date)
        setNote(expense.note ?? "")
      } else {
        setCategoryId("")
        setAmount("")
        setDate(format(new Date(), "yyyy-MM-dd"))
        setNote("")
      }
      setError("")
    }
  }, [open, expense])

  function handleClose() {
    if (isEdit) {
      onClose?.()
    } else {
      setInternalOpen(false)
    }
    setError("")
  }

  async function handleSave() {
    if (!categoryId || !amount || !date) return

    setLoading(true)
    setError("")

    try {
      if (isEdit && expense) {
        await updateExpense(expense.id, {
          category_id: categoryId,
          amount: Number(amount),
          date,
          note: note || undefined,
        })
      } else {
        await addExpense({
          category_id: categoryId,
          amount: Number(amount),
          date,
          note: note || undefined,
        })
      }
      handleClose()
      onSuccess()
    } catch {
      setError("Failed to save transaction. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-md bg-c1">
      <DialogHeader>
        <DialogTitle className="text-c3">
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-c3">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 focus:border-transparent transition bg-white text-c3"
          >
            {!isEdit && <option value="" hidden>Select category</option>}
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <FormInput
          label="Amount"
          placeholder="60.000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          formatNumber
        />

        <DatePicker
          label="Date"
          value={date}
          onChange={(val) => setDate(val)}
        />

        <FormInput
          label="Description"
          placeholder="e.g. Makan sate ayam"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {error && (
          <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end mt-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={loading || !categoryId || !amount || !date}
          >
            {loading ? "Saving..." : isEdit ? "Save Changes" : "Save"}
          </Button>
        </div>
      </div>
    </DialogContent>
  )

  // Add mode
  if (!isEdit) {
    return (
      <Dialog open={internalOpen} onOpenChange={setInternalOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 cursor-pointer">
            <Plus size={16} />
            Add Transaction
          </Button>
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  // Edit mode
  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose() }}>
      {dialogContent}
    </Dialog>
  )
}