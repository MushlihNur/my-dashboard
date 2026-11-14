import { Metadata } from "next"

export const metadata: Metadata = { title: "Documents | My Dashboard" }

export default function DocumentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}