export async function openMailPilotSidePanel(): Promise<void> {
  const w = await chrome.windows.getCurrent();
  if (w.id === undefined) {
    return;
  }
  await chrome.sidePanel.open({ windowId: w.id });
}
