chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open Side Panel",
    contexts: ["all"]
  });
  chrome.tabs.create({ url: "html/page.html" });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel") {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab.windowId });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  // The callback for runtime.onMessage must return falsy if we're not sending a response
  (async () => {
    if (message.type === "open_side_panel") {
      // This will open a tab-specific side panel only on the current tab.
      await chrome.sidePanel.open({ tabId: sender.tab.id });
      await chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: "index.html",
      });
    }
  })();
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "open_sidepanel") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.sidePanel.open({ windowId: currentTab.windowId });
    });
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  await chrome.sidePanel.open({ tabId });
  await chrome.sidePanel.setOptions({
    tabId,
    path: "index.html",
  });
});
