chrome.tabs.query({
  active: true,
  lastFocusedWindow: true,
}).then((tabs) => {
  const button = document.getElementById('openSidePanel');
  button.addEventListener('click', async () => {
    await chrome.sidePanel.open({ windowId: tabs[0].windowId });
  });
});
