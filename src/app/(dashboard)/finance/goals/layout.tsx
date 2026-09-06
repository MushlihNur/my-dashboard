import { Metadata } from "next"

export const metadata: Metadata = { title: "Goals | My Dashboard" }

export default function GoalsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}