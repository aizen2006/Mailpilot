import { useCallback, useRef, useState } from "react"
import type { ChatMessage } from "~Components/message/MessageList"
import { getApiBaseUrl } from "~lib/api"

type UseChatResult = {
  messages: ChatMessage[]
  conversationId: string | null
  isSending: boolean
  error: string | null
  sendMessage: (text: string, tone?: string) => Promise<boolean>
  sendAudioBlob: (blob: Blob) => Promise<boolean>
  clearError: () => void
}

export function useChat(userId: string | null): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const idCounter = useRef(0)

  const sendMessage = useCallback(
    async (text: string, tone?: string) => {
      if (!userId || !text.trim()) return false

      const userMsg: ChatMessage = {
        id: `local-${++idCounter.current}`,
        role: "user",
        text: text.trim(),
        meta: "You · just now",
      }
      setMessages((prev) => [...prev, userMsg])
      setIsSending(true)
      setError(null)

      try {
        const apiBase = getApiBaseUrl()
        const message = tone ? `[Tone: ${tone}] ${text.trim()}` : text.trim()
        const payload: Record<string, unknown> = { userId, message }
        if (conversationId) payload.conversationId = conversationId

        const res = await fetch(`${apiBase}/chat/text`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as { message?: string }
          throw new Error(errBody.message ?? `Request failed: ${res.status}`)
        }

        const data = (await res.json()) as {
          message: string
          conversationId: string
          Response: string
        }

        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }

        const assistantMsg: ChatMessage = {
          id: `local-${++idCounter.current}`,
          role: "assistant",
          text: data.Response,
          meta: "MailPilot AI",
        }
        setMessages((prev) => [...prev, assistantMsg])
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send message")
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
        return false
      } finally {
        setIsSending(false)
      }
    },
    [userId, conversationId]
  )

  const sendAudioBlob = useCallback(
    async (blob: Blob) => {
      if (!userId || blob.size === 0) return false

      const userMsg: ChatMessage = {
        id: `local-${++idCounter.current}`,
        role: "user",
        text: "Voice message",
        meta: "You · voice",
      }
      setMessages((prev) => [...prev, userMsg])
      setIsSending(true)
      setError(null)

      try {
        const apiBase = getApiBaseUrl()
        const form = new FormData()
        form.append("userId", userId)
        form.append("audio", blob, "voice.webm")
        if (conversationId) form.append("conversationId", conversationId)

        const res = await fetch(`${apiBase}/chat/audio`, {
          method: "POST",
          body: form,
        })

        if (!res.ok) {
          const errBody = (await res.json().catch(() => ({}))) as { message?: string }
          throw new Error(errBody.message ?? `Request failed: ${res.status}`)
        }

        const data = (await res.json()) as {
          message: string
          conversationId: string
          Response: string
        }

        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }

        const assistantMsg: ChatMessage = {
          id: `local-${++idCounter.current}`,
          role: "assistant",
          text: data.Response,
          meta: "MailPilot AI",
        }
        setMessages((prev) => [...prev, assistantMsg])
        return true
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send audio")
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id))
        return false
      } finally {
        setIsSending(false)
      }
    },
    [userId, conversationId]
  )

  return {
    messages,
    conversationId,
    isSending,
    error,
    sendMessage,
    sendAudioBlob,
    clearError: () => setError(null),
  }
}
