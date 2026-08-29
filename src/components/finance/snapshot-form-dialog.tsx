"use client"

import { addGoalSnapshot, updateGoalSnapshot } from "@/lib/api/goals"
import { GoalSnapshot } from "@/lib/supabase/types-helper"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { formatRupiah } from "@/lib/format"
import FormInput from "../ui/form-input"
import DatePicker from "../ui/date-picker"
import { notify } from "@/lib/toast"

interface SnapshotFormDialogProps {
  goalId?: string
  snapshot?: GoalSnapshot
  goalName: string
  currentAmount: number
  onSuccess: () => void
}

export default function SnapshotFormDialog({
  goalId,
  snapshot,
  goalName,
  currentAmount,
  onSuccess,
}: SnapshotFormDialogProps) {
  const isEdit = !!snapshot

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"))
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      if (snapshot) {
        setAmount(String(snapshot.amount))
        setDate(snapshot.date)
        setNote(snapshot.note ?? "")
      } else {
        setAmount("")
        setDate(format(new Date(), "yyyy-MM-dd"))
        setNote("")
      }
      setError("")
    }
  }, [open, snapshot])

  const newAmount = Number(amount)
  const baseAmount = isEdit ? (snapshot?.amount ?? 0) : currentAmount
  const change = newAmount - baseAmount
  const hasChange = newAmount > 0 && newAmount !== baseAmount

  function handleClose() {
    setOpen(false)
    setError("")
  }

  async function handleSave() {
    if (!amount || !date) return

    setLoading(true)
    setError("")

    try {
      if (isEdit && snapshot) {
        await updateGoalSnapshot(snapshot.id, {
          amount: Number(amount),
          date,
          note: note || undefined,
        })
      } else {
        await addGoalSnapshot({
          goal_id: goalId!,
          amount: Number(amount),
          date,
          note: note || undefined,
        })
      }
      handleClose()
      notify.success(isEdit ? "Snapshot updated" : "Snapshot added")
      onSuccess()
    } catch {
      setError("Failed to save snapshot. Please try again.")
      notify.error("Failed to save snapshot")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true) }}>
      <DialogTrigger asChild>
        {isEdit ? (
          <button className="p-1 rounded text-slate-300 hover:text-c2 hover:bg-c1 transition cursor-pointer opacity-0 group-hover:opacity-100">
            ✏️
          </button>
        ) : (
          <Button size="sm" className="cursor-pointer text-xs">
            Add Snapshot
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-c1">
        <DialogHeader>
          <DialogTitle className="text-c3">Add Snapshot</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="bg-white rounded-lg border border-c4 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-c2">Goal</span>
            <span className="text-sm font-medium text-c3">{goalName}</span>
          </div>

          {!isEdit && (
            <div className="bg-white rounded-lg border border-c4 px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-c2">Current Amount</span>
              <span className="text-sm font-medium text-c3">{formatRupiah(currentAmount)}</span>
            </div>
          )}

          <FormInput
            label={isEdit ? "Amount" : "New Amount"}
            placeholder="16.000.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            formatNumber
          />

          {hasChange && (
            <div className={`rounded-lg px-4 py-3 flex items-center justify-between text-sm ${
              change > 0
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}>
              <span className={change > 0 ? "text-green-700" : "text-red-600"}>
                {change > 0 ? "Increase" : "Decrease"}
              </span>
              <span className={`font-medium ${change > 0 ? "text-green-700" : "text-red-600"}`}>
                {change > 0 ? "+" : ""}{formatRupiah(change)}
              </span>
            </div>
          )}

          <DatePicker
            label="Date"
            value={date}
            onChange={(val) => setDate(val)}
          />

          <FormInput
            label="Note"
            placeholder="e.g. Top up Bibit, Bibit naik"
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
              disabled={loading || !amount || !date}
            >
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}