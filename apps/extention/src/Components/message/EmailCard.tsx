import { useMemo, useState } from "react"
import { Button } from "~Components/ui/Button"
import { Input, TextArea } from "~Components/ui/Input"
import { buildSendInstruction } from "~lib/email"

type EmailCardProps = {
  subject: string
  body: string
  isSending?: boolean
  onSend: (instruction: string) => Promise<void>
}

export function EmailCard({ subject, body, isSending = false, onSend }: EmailCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editableBody, setEditableBody] = useState(body)
  const [recipient, setRecipient] = useState("")
  const [isPreparingSend, setIsPreparingSend] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<"idle" | "sent">("idle")

  const canSend = useMemo(
    () => recipient.trim().length > 0 && editableBody.trim().length > 0 && !isSending && !isPreparingSend,
    [recipient, editableBody, isSending, isPreparingSend]
  )

  const copyContent = useMemo(
    () => `Subject: ${subject}\n\n${editableBody.trim()}`,
    [subject, editableBody]
  )

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyContent)
  }

  const handleSend = async () => {
    if (!canSend) return
    try {
      setError(null)
      setStatus("idle")
      setIsPreparingSend(true)
      const instruction = buildSendInstruction(recipient, subject, editableBody)
      await onSend(instruction)
      setStatus("sent")
      setRecipient("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send email")
    } finally {
      setIsPreparingSend(false)
    }
  }

  return (
    <div className="msg-enter rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 shadow-card">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-soft)]">Email</p>
        <div className="flex items-center gap-1">
          <Button onClick={() => void handleCopy()} size="sm" variant="ghost">
            Copy
          </Button>
          <Button
            onClick={() => setIsEditing((prev) => !prev)}
            size="sm"
            variant="ghost">
            {isEditing ? "Done" : "Edit"}
          </Button>
        </div>
      </div>

      <p className="text-sm text-[var(--color-text)]">
        <span className="font-semibold">Subject</span> {subject}
      </p>

      {isEditing ? (
        <TextArea className="mt-2 min-h-40" onChange={(e) => setEditableBody(e.target.value)} value={editableBody} />
      ) : (
        <pre className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-text)]">{editableBody}</pre>
      )}

      <div className="mt-3 flex items-center gap-2">
        <Input
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Recipient email (To)"
          type="email"
          value={recipient}
        />
        <Button disabled={!canSend} onClick={() => void handleSend()} variant="primary">
          {isSending || isPreparingSend ? "Sending..." : "Send"}
        </Button>
      </div>

      {error ? <p className="mt-2 text-xs text-rose-700">{error}</p> : null}
      {status === "sent" ? <p className="mt-2 text-xs text-emerald-700">Email sent.</p> : null}
    </div>
  )
}
