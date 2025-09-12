console.log("Background script loaded");

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

      console.log("Saving clip:", newClip);
      clips.unshift(newClip);
      chrome.storage.local.set({ clips });
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveImage",
    title: "Save image to Ctrl C Savior",
    contexts: ["image"]
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.contextMenus.create({
    id: "saveImage",
    title: "Save image to Ctrl C Savior",
    contexts: ["image"],
    "icons": {
      "48": "images/clipboard.png",
      "128": "images/clipboard.png"
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveImage") {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];
      const newClip = {
        image: info.srcUrl,
        url: tab.url,
        time: Date.now()
      };
      console.log(newClip);
      clips.unshift(newClip);
      chrome.storage.local.set({ clips }, () => {
        console.log("Image clip saved:", newClip);
      });
    });
  }
});