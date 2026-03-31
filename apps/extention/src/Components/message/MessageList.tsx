import { MessageBubble } from "~Components/message/MessageBubble"

export type ChatMessage = {
  id: string
  role: "user" | "assistant" | "system"
  text: string
  meta?: string
}

const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "Draft a concise follow-up email asking for timeline updates.",
    meta: "You · just now"
  },
  {
    id: "m2",
    role: "assistant",
    text: "Hi Alex, checking in on the timeline we discussed. Could you share the latest status and next milestones?",
    meta: "AI Assistant"
  }
]

type MessageListProps = {
  messages?: ChatMessage[]
}

export function MessageList({ messages = mockMessages }: MessageListProps) {
  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} meta={message.meta} role={message.role} text={message.text} />
      ))}
    </div>
  )
}
