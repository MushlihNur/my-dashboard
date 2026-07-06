"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import FormInput from "../ui/form-input"
import { EXPENSE_CATEGORIES } from "@/lib/mock/expenses"

export default function AddExpenseDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 cursor-pointer">
          <Plus size={16} />
          Add Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-c1">
        <DialogHeader>
          <DialogTitle className="text-c3">Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-c3">Category</label>
            <select className="w-full px-3 py-2 text-sm border border-c4 rounded-lg outline-none focus:ring-2 focus:ring-c3 focus:border-transparent transition bg-white text-c3">
              <option value="" selected hidden>Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
            <FormInput label="Amount" type="number" placeholder="60.000" formatNumber />
            <FormInput label="Date" type="date" />
            <FormInput label="Description" placeholder="e.g. Makan sate ayam" />

            <div className="flex gap-2 justify-end mt-2">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button className="cursor-pointer">
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}