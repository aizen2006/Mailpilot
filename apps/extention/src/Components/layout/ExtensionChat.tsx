import { ChatLayout } from "~Components/layout/ChatLayout"
import { MessageList } from "~Components/message/MessageList"
import { SearchBar } from "~Components/search/SearchBar"
import { ChatSkeleton } from "~Components/states/ChatSkeleton"
import { EmptyState } from "~Components/states/EmptyState"
import { ErrorState } from "~Components/states/ErrorState"
import { TopBar } from "~Components/topbar/TopBar"
import { Button } from "~Components/ui/Button"

type UiState = "loading" | "empty" | "error" | "ready"

type ExtensionChatProps = {
  mode: "popup" | "sidebar"
  state?: UiState
}

function ChatBody({ state }: { state: UiState }) {
  if (state === "loading") return <ChatSkeleton />
  if (state === "empty") return <EmptyState />
  if (state === "error") return <ErrorState />
  return <MessageList />
}

export function ExtensionChat({ mode, state = "ready" }: ExtensionChatProps) {
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
      header={<TopBar />}
      mode={mode}>
      <ChatBody state={state} />
    </ChatLayout>
  )
}
