import { Metadata } from "next"

export const metadata: Metadata = { title: "Home | My Dashboard" }

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}