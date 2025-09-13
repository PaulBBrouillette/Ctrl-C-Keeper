// Handle messages from popup.js (manual save)
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "SAVE_CLIP") {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];

      const newClip = {
        text: msg.text || null,
        image: msg.image || null,
        url: sender.tab ? sender.tab.url : msg.source || null,
        time: Date.now()
      };

      console.log("Saving clip (manual):", newClip);
      clips.unshift(newClip);
      chrome.storage.local.set({ clips });
    });
  }
});

// Create context menus once when extension is installed/updated
chrome.runtime.onInstalled.addListener(() => {
  // Save image
  chrome.contextMenus.create({
    id: "saveImage",
    title: "Save image to ClipVault",
    contexts: ["image"]
  });

  // Save selected text
  chrome.contextMenus.create({
    id: "saveText",
    title: "Save selection to ClipVault",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveImage") {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];
      const newClip = {
        image: info.srcUrl,
        url: tab.url,
        time: Date.now()
      };
      console.log("Saving image clip:", newClip);
      clips.unshift(newClip);
      chrome.storage.local.set({ clips });
    });
  }

  if (info.menuItemId === "saveText") {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];
      const newClip = {
        text: info.selectionText,
        url: tab.url,
        time: Date.now()
      };
      console.log("Saving text clip:", newClip);
      clips.unshift(newClip);
      chrome.storage.local.set({ clips });
    });
  }
});