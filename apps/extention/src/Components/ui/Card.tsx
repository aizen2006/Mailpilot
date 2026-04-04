import type { HTMLAttributes } from "react"
import cn from "~libs/cn"

type CardProps = HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-card transition-shadow duration-150 ease-out",
        className
      )}
      {...props}
    />
  )
}
