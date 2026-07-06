import AddExpenseDialog from "../finance/add-expenses-dialog";
import AddIncomeDialog from "../finance/add-income-dialog";

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-c3">Quick Actions</h2>

      <div className="flex flex-wrap gap-3">
        <AddExpenseDialog />
        <AddIncomeDialog />
      </div>
    </div>
  )
}