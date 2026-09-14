"use client"

import { FileText, LayoutDashboard, LogOut, Menu, User, Users, Wallet, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Finance", href: "/finance", icon: Wallet },
  { label: "Family", href: "/family", icon: Users },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Profile", href: "/profile", icon: User },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-c3 text-white"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "bg-c3 flex flex-col transition-all duration-300 z-50",
          "fixed md:sticky top-0 left-0",
          "w-full h-screen",
          isCollapsed ? "md:w-20" : "md:w-60",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            "px-6 py-5 border-b border-c2 flex items-center shrink-0",
            isCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!isCollapsed && (
            <h1 className="text-white font-semibold text-lg">
              My Dashboard
            </h1>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:block text-white"
            >
              <Menu size={18} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition shrink-0",
                  isCollapsed
                    ? "justify-center px-2 py-3"
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? "bg-c2 text-white font-medium"
                    : "text-slate-400 hover:bg-c2 hover:text-white"
                )}
              >
                <Icon size={18} />
                {!isCollapsed && (
                  <span>{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="px-4 py-4 border-t border-c2 flex items-center justify-between shrink-0">
            <p className="text-xs text-slate-500">Mushlih © 2026</p>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition cursor-pointer p-1.5 rounded-lg hover:bg-c2"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        {isCollapsed && (
          <div className="px-4 py-4 border-t border-c2 flex justify-center shrink-0">
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 transition cursor-pointer p-1.5 rounded-lg hover:bg-c2"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}