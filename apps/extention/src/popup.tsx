import "./style.css"

import { PopupDashboard } from "~Components/layout/PopupDashboard"
import { PageShell } from "~Components/layout/PageShell"

function IndexPopup() {
  return (
    <PageShell mode="popup">
      <PopupDashboard />
    </PageShell>
  )
}

export default IndexPopup
