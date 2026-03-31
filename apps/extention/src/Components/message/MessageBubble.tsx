import { cva, type VariantProps } from "class-variance-authority"
import cn from "~libs/cn"

const bubbleVariants = cva("max-w-[90%] rounded-[var(--radius-lg)] px-3 py-2 text-sm leading-relaxed", {
  variants: {
    role: {
      user: "ml-auto bg-[var(--color-primary)] text-white",
      assistant: "mr-auto border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)]",
      system: "mx-auto bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]"
    }
  },
  defaultVariants: {
    role: "assistant"
  }
})

type MessageBubbleProps = VariantProps<typeof bubbleVariants> & {
  text: string
  meta?: string
}

export function MessageBubble({ role, text, meta }: MessageBubbleProps) {
  return (
    <div className={cn("space-y-1", role === "user" && "items-end")}>
      <div className={bubbleVariants({ role })}>{text}</div>
      {meta ? <p className="px-1 text-xs text-[var(--color-text-soft)]">{meta}</p> : null}
    </div>
  )
}
