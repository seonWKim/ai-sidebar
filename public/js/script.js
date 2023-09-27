// top level await is available in ES modules loaded from script tags
const [tab] = await chrome.tabs.query({
  active: true,
  lastFocusedWindow: true
});

const tabId = tab.id;
const button = document.getElementById('openSidePanel');
button.addEventListener('click', async () => {
  await chrome.sidePanel.open({tabId});
  await chrome.sidePanel.setOptions({
    tabId,
    path: 'index.html',
    enabled: true
  });
});


chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id
  chrome.sidePanel.open({tabId});
})
