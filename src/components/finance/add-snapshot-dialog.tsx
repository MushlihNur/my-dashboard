"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { formatRupiah } from "@/lib/format"
import FormInput from "../ui/form-input"
import DatePicker from "../ui/date-picker"

interface AddSnapshotDialogProps {
  goalName: string
  currentAmount: number
}

export default function AddSnapshotDialog({ goalName, currentAmount }: AddSnapshotDialogProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [note, setNote] = useState("")

  const newAmount = Number(amount)
  const change = newAmount - currentAmount
  const hasAmount = newAmount > 0 && newAmount !== currentAmount

  function handleClose() {
    setOpen(false)
    setAmount("")
    setNote("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="default" className="cursor-pointer">
          Add Snapshot
        </Button>
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

          <div className="bg-white rounded-lg border border-c4 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-c2">Current Amount</span>
            <span className="text-sm font-medium text-c3">{formatRupiah(currentAmount)}</span>
          </div>

          <FormInput
            label="New Amount"
            type="number"
            placeholder="15.000.000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            formatNumber
          />

          {hasAmount && (
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

          <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              disabled={!amount || !date}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}