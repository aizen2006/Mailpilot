import { useCallback, useState } from "react"
import { Badge } from "~Components/ui/Badge"
import { Button } from "~Components/ui/Button"
import { TextArea } from "~Components/ui/Input"
import cn from "~libs/cn"

const TONES = ["Professional", "Concise", "Quick reply"] as const
type Tone = (typeof TONES)[number]

export type VoiceControl = {
  isRecording: boolean
  start: () => void | Promise<void>
  stop: () => void
}

type SearchBarProps = {
  onSubmit: (text: string, tone: Tone | null) => void
  disabled?: boolean
  onVoice?: VoiceControl
  micError?: string | null
}

export function SearchBar({ onSubmit, disabled = false, onVoice, micError }: SearchBarProps) {
  const [text, setText] = useState("")
  const [activeTone, setActiveTone] = useState<Tone | null>(null)
  const sendModifier =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
      ? "⌘"
      : "Ctrl"

  const composerLocked = disabled || !!onVoice?.isRecording

  const handleGenerate = useCallback(() => {
    if (!text.trim() || composerLocked) return
    onSubmit(text.trim(), activeTone)
    setText("")
  }, [text, activeTone, composerLocked, onSubmit])

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
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          Ask MailPilot
        </h2>
        <Badge variant="tone">{activeTone ? `${activeTone} tone` : "Neutral tone"}</Badge>
      </div>

      <div className="flex flex-col gap-3">
        <TextArea
          disabled={composerLocked}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Summarize this thread, draft a reply, or ask for next steps…"
          rows={4}
          value={text}
        />
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {TONES.map((tone) => (
              <button
                key={tone}
                disabled={composerLocked}
                onClick={() => setActiveTone((prev) => (prev === tone ? null : tone))}
                type="button"
                className={cn(
                  "inline-flex cursor-pointer items-center rounded-full px-2.5 py-1 text-xs font-medium transition-[transform,background-color,color] duration-100 ease-[var(--ease-out)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
                  activeTone === tone
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-muted)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
                )}>
                {tone}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              aria-label="Attach files"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-base transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-[var(--color-bg-muted)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
              disabled={composerLocked}
              type="button">
              +
            </button>
            {onVoice ? (
              <button
                aria-label={onVoice.isRecording ? "Stop recording" : "Start voice message"}
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-lg transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-[var(--color-bg-muted)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
                  onVoice.isRecording && "mic-recording-pulse"
                )}
                disabled={disabled && !onVoice.isRecording}
                onClick={() => (onVoice.isRecording ? onVoice.stop() : void onVoice.start())}
                type="button">
                {onVoice.isRecording ? "⏹" : "🎙"}
              </button>
            ) : null}
            <Button
              disabled={composerLocked || !text.trim()}
              onClick={handleGenerate}
              size="md"
              variant="primary">
              {disabled ? "Sending…" : "Send"}
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-soft)]">
          <p>{sendModifier} Enter to send</p>
          <p>Modes: Attach file, Thinking, Better model</p>
        </div>
        {micError ? (
          <p className="text-xs text-rose-600">{micError}</p>
        ) : null}
      </div>
    </div>
  )
}
