import FinanceNav from "@/components/finance/finance-nav"

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-c3">Finance</h1>
        <p className="text-sm text-c2 mt-1">Kelola Keuangan Kamu</p>
      </div>
      <FinanceNav />
      {children}
    </div>
  )
}