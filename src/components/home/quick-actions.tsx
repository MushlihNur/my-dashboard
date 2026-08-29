import ExpenseFormDialog from "../finance/expense-form-dialog";
import IncomeFormDialog from "../finance/income-form-dialog";

interface QuickActionsProps {
  onSuccess: () => void
}

export default function QuickActions({ onSuccess }: QuickActionsProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-c3">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        <ExpenseFormDialog onSuccess={onSuccess} />
        <IncomeFormDialog onSuccess={onSuccess} />
      </div>
    </div>
  )
}