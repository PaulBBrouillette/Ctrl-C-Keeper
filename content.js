console.log("Content script running");
document.addEventListener("copy", () => {
  navigator.clipboard.readText().then((text) => {
    console.log("Content script text: " + text);
    if (text) {
      chrome.runtime.sendMessage({ type: "SAVE_CLIP", text });
    }
  });
});