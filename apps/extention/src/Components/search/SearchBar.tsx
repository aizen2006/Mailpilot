import { useCallback, useState } from "react"
import { Badge } from "~Components/ui/Badge"
import { Button } from "~Components/ui/Button"
import { TextArea } from "~Components/ui/Input"
import cn from "~libs/cn"

const TONES = ["Professional", "Concise", "Quick reply"] as const
type Tone = (typeof TONES)[number]

type SearchBarProps = {
  onSubmit: (text: string, tone: Tone | null) => void
  disabled?: boolean
}

export function SearchBar({ onSubmit, disabled = false }: SearchBarProps) {
  const [text, setText] = useState("")
  const [activeTone, setActiveTone] = useState<Tone | null>(null)
  const sendModifier =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
      ? "⌘"
      : "Ctrl"

  const handleGenerate = useCallback(() => {
    if (!text.trim() || disabled) return
    onSubmit(text.trim(), activeTone)
    setText("")
  }, [text, activeTone, disabled, onSubmit])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleGenerate()
      }
    },
    [handleGenerate]
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          Generate reply
        </h2>
        <Badge variant="tone">Active persona</Badge>
      </div>

      <div className="space-y-3">
        <TextArea
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Reply to sender, summarize context, or write a follow-up…"
          rows={3}
          value={text}
        />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {TONES.map((tone) => (
              <button
                key={tone}
                onClick={() => setActiveTone((prev) => (prev === tone ? null : tone))}
                type="button"
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-full px-2.5 py-1 text-xs font-medium transition-[transform,background-color,color] duration-100 ease-[var(--ease-out)] active:scale-[0.97]",
                  activeTone === tone
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
                )}>
                {tone}
              </button>
            ))}
          </div>
          <Button
            disabled={disabled || !text.trim()}
            onClick={handleGenerate}
            size="md"
            variant="primary">
            {disabled ? "Generating…" : "Generate"}
          </Button>
        </div>
        <p className="text-xs text-[var(--color-text-soft)]">{sendModifier} Enter to send</p>
      </div>
    </div>
  )
}
