import type { PropsWithChildren, ReactNode } from "react"
import { Card } from "~Components/ui/Card"
import cn from "~libs/cn"

type ChatLayoutProps = PropsWithChildren<{
  header: ReactNode
  composer: ReactNode
  footer?: ReactNode
  mode: "popup" | "sidebar"
}>

export function ChatLayout({ header, composer, footer, children, mode }: ChatLayoutProps) {
  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", mode === "sidebar" && "mx-auto max-w-2xl")}>
      <div className="border-b border-[var(--color-border)] p-4">{header}</div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--color-bg)] p-4">{children}</div>
      <div className="border-t border-[var(--color-border)] p-4">{composer}</div>
      {footer ? <div className="border-t border-[var(--color-border)] p-3">{footer}</div> : null}
    </Card>
  )
}
