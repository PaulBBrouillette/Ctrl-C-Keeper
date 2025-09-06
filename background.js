console.log("Background script loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("Background received message:", msg);

  if (msg.type === "SAVE_CLIP" && msg.text) {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];
      const newClip = { text: msg.text, time: Date.now() };
      console.log("Adding new clip:", newClip);

      clips.unshift(newClip);

      chrome.storage.local.set({ clips }, () => {
        console.log("Clips saved:", clips);
      });
    });
  }
});