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

  const contentCell = document.createElement("td");
  if (clip.text) {
    contentCell.textContent = clip.text;
  } else if (clip.image) {
    const img = document.createElement("img");
    img.src = clip.image;
    img.style.maxWidth = "100px";
    img.style.maxHeight = "60px";
    contentCell.appendChild(img);
  }

  const urlCell = document.createElement("td");
  if (clip.url) {
    const link = document.createElement("a");
    link.href = clip.url;
    link.textContent = "Source";
    link.target = "_blank";
    urlCell.appendChild(link);
  }
  else {
    const src = document.createElement("p");
    src.textContent = "Manual";
    urlCell.appendChild(src);
  }

  const timeCell = document.createElement("td");
  timeCell.textContent = formatTime(clip.time);

  const actionCell = document.createElement("td");
  const delBtn = document.createElement("button");
  delBtn.innerHTML = "&#10060;";
  delBtn.addEventListener("click", () => {
    chrome.storage.local.get(["clips"], (data) => {
      const clips = data.clips || [];
      clips.splice(index, 1);
      chrome.storage.local.set({ clips });
    });
  });
  actionCell.appendChild(delBtn);

  row.appendChild(contentCell);
  row.appendChild(urlCell);
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
    console.log("Clip not being made");
  }
});

renderClips();