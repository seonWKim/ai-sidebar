chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open Side Bar',
    contexts: ['all'],
  });
  chrome.contextMenus.create({
    id: 'openFullPage',
    title: 'Open Full Page',
    contexts: ['all'],
  });
  chrome.tabs.create({ url: 'landing.html' });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case 'openSidePanel':
      chrome.sidePanel.open({ windowId: tab.windowId });
      break;
    case 'openFullPage':
      chrome.tabs.create({ url: 'index.html' });
      break;
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  // The callback for runtime.onMessage must return falsy if we're not sending a response
  (async () => {
    if (message.type === 'open_side_panel') {
      await chrome.sidePanel.open({ windowId: sender.tab.windowId });
    }
  })();
});

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ windowId: tab.windowId });
});
