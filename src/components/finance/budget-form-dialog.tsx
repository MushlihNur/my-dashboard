"use client"

import { upsertBudget } from "@/lib/api/budget"
import { notify } from "@/lib/toast"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Pencil } from "lucide-react"
import FormInput from "../ui/form-input"
import { Button } from "../ui/button"

interface BudgetFormDialogProps {
  year: number
  month: number
  currentLimit: number
  onSuccess: () => void
}

export default function BudgetFormDialog({
  year,
  month,
  currentLimit,
  onSuccess
}: BudgetFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setAmount(currentLimit > 0 ? String(currentLimit) : "")
    }
  }, [open, currentLimit])

  const monthLabel = format(new Date(year, month - 1), "MMMM yyyy")

  function handleClose() {
    setOpen(false)
    setAmount("")
  }

  async function handleSave() {
    if (!amount) return
    setLoading(true)

    try {
      await upsertBudget({
        year,
        month,
        limit_amount: Number(amount),
      })
      notify.success("Budget limit updated")
      handleClose()
      onSuccess()
    } catch {
      notify.error("Failed to update budget limit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        <button className="p-1 rounded hover:bg-slate-100 transition cursor-pointer text-slate-400 hover:text-c2">
          <Pencil size={12} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm bg-c1">
        <DialogHeader>
          <DialogTitle className="text-c3">Set Monthly Limit</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <p className="text-xs text-c2 bg-white rounded-lg border border-c4 px-4 py-3">
            {monthLabel}
          </p>

          <FormInput
            label="Limit Amount"
            placeholder="4.500.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            formatNumber
          />

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
              disabled={loading || !amount}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}