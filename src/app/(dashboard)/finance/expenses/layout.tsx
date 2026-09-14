import { Metadata } from "next"

export const metadata: Metadata = { title: "Expenses | My Dashboard" }

export default function ExpensesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}