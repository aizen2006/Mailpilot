import { useCallback } from "react"
import { ChatLayout } from "~Components/layout/ChatLayout"
import { MessageList } from "~Components/message/MessageList"
import { SearchBar } from "~Components/search/SearchBar"
import { ChatSkeleton } from "~Components/states/ChatSkeleton"
import { EmptyState } from "~Components/states/EmptyState"
import { ErrorState } from "~Components/states/ErrorState"
import { TopBar } from "~Components/topbar/TopBar"
import { useChat } from "~hooks/useChat"
import { useSendAudio } from "~hooks/useSendAudio"
import { useGmailStatus } from "~hooks/useGmailStatus"

type ExtensionChatProps = {
  userId: string
}

export function ExtensionChat({ userId }: ExtensionChatProps) {
  const userLoading = false
  const gmail = useGmailStatus(userId)
  const { messages, isSending, error, sendMessage, sendAudioBlob, clearError } = useChat(userId)
  const voice = useSendAudio({
    sendAudioBlob,
    disabled: isSending,
  })

  const uiState = userLoading
    ? "loading"
    : error
      ? "error"
      : messages.length === 0
        ? "empty"
        : "ready"

  const onSettings = useCallback(() => {
    void chrome.runtime.openOptionsPage()
  }, [])

  const onClose = useCallback(() => {
    window.close()
  }, [])

  return (
    <ChatLayout
      composer={
        <SearchBar
          disabled={isSending || userLoading || voice.isRecording}
          micError={voice.micError}
          onSubmit={(text, tone) => void sendMessage(text, tone ?? undefined)}
          onVoice={{
            isRecording: voice.isRecording,
            start: () => void voice.startRecording(),
            stop: voice.stopRecording,
          }}
        />
      }
      header={
        <TopBar
          gmailConnected={gmail.connected}
          gmailEmail={gmail.email}
          gmailLoading={gmail.loading || userLoading}
          onClose={onClose}
          onSettings={onSettings}
        />
      }>
      {uiState === "loading" && <ChatSkeleton />}
      {uiState === "empty" && <EmptyState />}
      {uiState === "error" && (
        <ErrorState message={error ?? undefined} onRetry={clearError} />
      )}
      {uiState === "ready" && (
        <MessageList
          isSending={isSending}
          messages={messages}
          onSendInstruction={(instruction) => sendMessage(instruction)}
        />
      )}
    </ChatLayout>
  )
}
