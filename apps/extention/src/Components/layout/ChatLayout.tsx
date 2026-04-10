import type { PropsWithChildren, ReactNode } from "react"
import { Card } from "~Components/ui/Card"

type ChatLayoutProps = PropsWithChildren<{
  header: ReactNode
  composer: ReactNode
  footer?: ReactNode
}>

export function ChatLayout({ header, composer, footer, children }: ChatLayoutProps) {
  return (
    <Card className="mx-auto flex h-full max-w-2xl flex-col overflow-hidden">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 pb-4 pt-3 sm:px-5">
        {header}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--color-bg)] px-3 py-4 sm:px-4">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)]/80 bg-[var(--color-bg-elevated)]/60 p-3 sm:p-4">
          {children}
        </div>
      </div>
      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 pb-4 pt-3 sm:px-5">
        {composer}
      </div>
      {footer ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-muted)]/30 p-3">
          {footer}
        </div>
      ) : null}
    </Card>
  )
}
