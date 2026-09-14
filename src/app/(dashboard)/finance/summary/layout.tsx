import { Metadata } from "next"

export const metadata: Metadata = { title: "Summary | My Dashboard" }

export default function SummaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}