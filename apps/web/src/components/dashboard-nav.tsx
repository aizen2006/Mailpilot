"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

const nav = [
  { href: "/dashboard/overview", label: "Overview", icon: "▦" },
  { href: "/dashboard/usage", label: "Usage", icon: "◈" },
  { href: "/dashboard/spending", label: "Spending", icon: "◎" },
  { href: "/dashboard/billing", label: "Billing", icon: "◇" },
  { href: "/dashboard/settings", label: "Settings", icon: "◉" },
  { href: "/connect/gmail", label: "Connect Gmail", icon: "◌" },
] as const

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="mt-8 flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex items-center gap-3 rounded-(--mp-radius-md) px-3 py-2.5 text-sm font-medium transition-colors duration-150"
            style={{
              color: active ? "var(--mp-primary)" : "var(--mp-text-muted)",
            }}
          >
            {/* Animated active background via layoutId */}
            {active && (
              <motion.span
                layoutId="nav-indicator"
                className="absolute inset-0 rounded-(--mp-radius-md)"
                style={{ backgroundColor: "var(--mp-surface)" }}
                transition={{ type: "spring", duration: 0.25, bounce: 0.1 }}
              />
            )}
            <span className="relative z-10 text-xs opacity-60">{item.icon}</span>
            <span className="relative z-10">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
