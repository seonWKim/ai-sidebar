chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
}).then(tabs => {
  const tabId = tabs[0].id;
  const button = document.getElementById('openSidePanel');
  button.addEventListener('click', async () => {
    await chrome.sidePanel.open({tabId});
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'index.html',
    });
  });
})

