import { ChatLayout } from "~Components/layout/ChatLayout"
import { MessageList } from "~Components/message/MessageList"
import { SearchBar } from "~Components/search/SearchBar"
import { ChatSkeleton } from "~Components/states/ChatSkeleton"
import { EmptyState } from "~Components/states/EmptyState"
import { ErrorState } from "~Components/states/ErrorState"
import { TopBar } from "~Components/topbar/TopBar"
import { Button } from "~Components/ui/Button"
import { useExtensionUser } from "~hooks/useExtensionUser"
import { useGmailStatus } from "~hooks/useGmailStatus"

type UiState = "loading" | "empty" | "error" | "ready"

type ExtensionChatProps = {
  state?: UiState
}

function ChatBody({ state }: { state: UiState }) {
  if (state === "loading") {
    return <ChatSkeleton />
  }
  if (state === "empty") {
    return <EmptyState />
  }
  if (state === "error") {
    return <ErrorState />
  }
  return <MessageList />
}

export function ExtensionChat({ state = "ready" }: ExtensionChatProps) {
  const { userId, loading: userLoading } = useExtensionUser()
  const gmail = useGmailStatus(userId)

  return (
    <ChatLayout
      composer={<SearchBar />}
      footer={
        <div className="flex items-center gap-2">
          <Button className="flex-1" variant="primary">
            Send Directly to Gmail
          </Button>
          <Button variant="ghost">Copy</Button>
        </div>
      }
      header={
        <TopBar
          gmailConnected={gmail.connected}
          gmailEmail={gmail.email}
          gmailLoading={gmail.loading || userLoading}
        />
      }>
      <ChatBody state={state} />
    </ChatLayout>
  )
}
