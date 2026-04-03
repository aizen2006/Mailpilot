import type { HTMLAttributes } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import cn from "~libs/cn"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        status: "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]",
        tone: "bg-[var(--color-tone-bg)] text-[var(--color-tone-fg)]"
      }
    },
    defaultVariants: {
      variant: "status"
    }
  }
)

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
