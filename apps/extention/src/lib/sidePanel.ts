export async function openMailPilotSidePanel(): Promise<void> {
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true })
  const windowId = activeTab?.windowId
  if (windowId === undefined) return
  await chrome.sidePanel.open({ windowId })
}
