import { Metadata } from "next"

export const metadata: Metadata = { title: "Profile | My Dashboard" }

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}