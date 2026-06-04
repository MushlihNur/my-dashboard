"use client"

import { FileText, LayoutDashboard, User, Users, Wallet } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Finance", href: "/finance", icon: Wallet },
  { label: "Family", href: "/family", icon: Users },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Profile", href: "/profile", icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen bg-c3 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-c2">
        <h1 className="text-white font-semibold text-lg">My Dashboard</h1>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || 
            (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                isActive
                  ? "bg-c2 text-white font-medium"
                  : "text-slate-400 hover:bg-c2 hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-c2">
        <p className="text-xs text-slate-500">Mushlih © 2026</p>
      </div>
    </aside>
  )
}