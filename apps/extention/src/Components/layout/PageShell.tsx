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
        "relative isolate bg-[var(--color-bg)] p-3 text-[var(--color-text)] antialiased",
        mode === "popup"
          ? "h-[560px] w-[390px]"
          : "h-screen min-h-screen w-full max-w-none p-4",
        className
      )}>
      {children}
    </main>
  )
}
