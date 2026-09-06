import { Metadata } from "next"

export const metadata: Metadata = { title: "Income | My Dashboard" }

export default function IncomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}