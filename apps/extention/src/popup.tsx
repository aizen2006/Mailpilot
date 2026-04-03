import "./style.css"

import { ExtensionChat } from "~Components/layout/ExtensionChat"
import { PageShell } from "~Components/layout/PageShell"

function IndexPopup() {
  return (
    <PageShell mode="popup">
      <ExtensionChat mode="popup" state="ready" />
    </PageShell>
  )
}

export default IndexPopup
