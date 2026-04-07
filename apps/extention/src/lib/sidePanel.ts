export async function openMailPilotSidePanel(): Promise<void> {
  const current = await chrome.windows.getCurrent()
  const windowId = current.id
  if (windowId === undefined) return
  await chrome.sidePanel.open({ windowId })
}
