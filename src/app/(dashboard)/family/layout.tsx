import { Metadata } from "next"

export const metadata: Metadata = { title: "Family | My Dashboard" }

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}