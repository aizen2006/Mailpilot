import { useEffect, useRef } from "react"
import { EmailCard } from "~Components/message/EmailCard"
import { MessageBubble } from "~Components/message/MessageBubble"
import { TypingIndicator } from "~Components/message/TypingIndicator"
import { parseEmailFromText } from "~lib/email"

export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "system"
  text: string
  meta?: string
}

type MessageListProps = {
  messages: ChatMessage[]
  isSending?: boolean
  onSendInstruction?: (instruction: string) => Promise<boolean>
}

export function MessageList({ messages, isSending = false, onSendInstruction }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        (() => {
          const parsedEmail =
            message.role === "assistant" ? parseEmailFromText(message.text) : null
          if (parsedEmail && onSendInstruction) {
            return (
              <EmailCard
                body={parsedEmail.body}
                isSending={isSending}
                key={message.id}
                onSend={async (instruction) => {
                  const ok = await onSendInstruction(instruction)
                  if (!ok) throw new Error("Send failed")
                }}
                subject={parsedEmail.subject}
              />
            )
          }

          return (
            <MessageBubble
              key={message.id}
              meta={message.meta}
              role={message.role}
              text={message.text}
            />
          )
        })()
      ))}
      {isSending ? <TypingIndicator /> : null}
      <div ref={bottomRef} />
    </div>
  )
}
