import "./style.css"

import { ExtensionChat } from "~Components/layout/ExtensionChat"
import { PageShell } from "~Components/layout/PageShell"

function SidePanel() {
  return (
    <PageShell mode="sidebar">
      <ExtensionChat mode="sidebar" state="ready" />
    </PageShell>
  )
}

export default SidePanel
