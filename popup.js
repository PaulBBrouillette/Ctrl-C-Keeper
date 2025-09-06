const clipsBody = document.getElementById("clipsBody");
const saveManualBtn = document.getElementById("saveManual");
const manualInput = document.getElementById("manualInput");
const clearAllBtn = document.getElementById("clearAll");

console.log("Popup js");

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function createClipRow(clip, index) {
  const row = document.createElement("tr");

  // Text content
  const textCell = document.createElement("td");
  textCell.textContent = clip.text;
  textCell.style.cursor = "pointer";
  textCell.addEventListener("click", () => {
    navigator.clipboard.writeText(clip.text);
  });

  // Time content
  const timeCell = document.createElement("td");
  timeCell.textContent = formatTime(clip.time);

  const actionCell = document.createElement("td");
  const delBtn = document.createElement("button");
  delBtn.innerHTML = "&#10060;";
  delBtn.style.cursor = "pointer";
  delBtn.style.border = "none";
  delBtn.style.background = "transparent";
  delBtn.title = "Delete this clip";

  delBtn.addEventListener("click", () => {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];
      clips.splice(index, 1); // remove this clip
      chrome.storage.local.set({ clips });
    });
  });

  actionCell.appendChild(delBtn);

  row.appendChild(textCell);
  row.appendChild(timeCell);
  row.appendChild(actionCell);

  return row;
}

function renderClips() {
  chrome.storage.local.get(["clips"], (data) => {
    const clips = data.clips || [];
    console.log("Clips: " + clips);
    clipsBody.innerHTML = "";
    clips.forEach((clip, index) => {
      const row = createClipRow(clip, index);
      console.log("Row: " + row);
      clipsBody.appendChild(row);
    });
  });
}

saveManualBtn.addEventListener("click", () => {
  console.log("Save button click");
  const text = manualInput.value.trim();
  if (text) {
    console.log("Popup sending SAVE_CLIP:", text);
    chrome.runtime.sendMessage({ type: "SAVE_CLIP", text });
    manualInput.value = "";
  }
});

clearAllBtn.addEventListener("click", () => {
  chrome.storage.local.set({ clips: [] });
});

chrome.storage.onChanged.addListener((changes, area) => {
  console.log(changes);
  console.log(area);
  if (area === "local" && changes.clips) {
    renderClips();
  }
  else {
    console.log("Clup not being made");
  }
});

renderClips();