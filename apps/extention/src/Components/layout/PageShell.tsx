import type { PropsWithChildren } from "react"
import cn from "~libs/cn"

type PageShellProps = PropsWithChildren<{
  mode: "popup" | "sidebar"
  className?: string
}>

export function PageShell({ mode, className, children }: PageShellProps) {
  return (
    <main
      className={cn(
        "relative isolate bg-[var(--color-bg)] text-[var(--color-text)] antialiased",
        mode === "popup"
          ? "h-[550px] w-[380px] p-4 text-sm"
          : "h-screen w-full max-w-none p-4 text-sm",
        className
      )}>
      {children}
    </main>
  )
}
