const clipsBody = document.getElementById("clipsBody");
const saveManualBtn = document.getElementById("saveManual");
const manualInput = document.getElementById("manualInput");
const clearAllBtn = document.getElementById("clearAll");

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function createClipRow(clip, index) {
  const row = document.createElement("tr");

  // Text or image
  const contentCell = document.createElement("td");
  if (clip.text) {
    contentCell.textContent = clip.text;
    contentCell.style.cursor = "pointer";
    contentCell.title = "Click to copy text";
    contentCell.addEventListener("click", () => {
      navigator.clipboard.writeText(clip.text).then(() => {
        flashCell(contentCell);
      });
    });
  } else if (clip.image) {
    const img = document.createElement("img");
    img.src = clip.image;
    img.style.maxWidth = "100px";
    img.style.maxHeight = "60px";
    img.style.cursor = "pointer";
    img.title = "Click to copy image URL";
    img.addEventListener("click", async () => {
      await navigator.clipboard.writeText(img.src);
      flashCell(contentCell);
    });
    contentCell.appendChild(img);
  }

  // Source
  const urlCell = document.createElement("td");
  if (clip.url) {
    const link = document.createElement("a");
    link.href = clip.url;
    link.textContent = clip.url.length > 20 ? "Source" : clip.url;
    link.target = "_blank";
    urlCell.appendChild(link);
  } else {
    urlCell.textContent = "Manual";
  }

  // Time saved
  const timeCell = document.createElement("td");
  timeCell.textContent = formatTime(clip.time);

  // Delete
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

function flashCell(cell) {
  cell.style.backgroundColor = "#7bda91ff";
  setTimeout(() => (cell.style.backgroundColor = ""), 300);
}

function renderClips() {
  chrome.storage.local.get(["clips"], (data) => {
    const clips = data.clips || [];
    clipsBody.innerHTML = "";
    clips.forEach((clip, index) => {
      const row = createClipRow(clip, index);
      clipsBody.appendChild(row);
    });
  });
}

// Manual
saveManualBtn.addEventListener("click", () => {
  const text = manualInput.value.trim();
  if (text) {
    chrome.runtime.sendMessage({ type: "SAVE_CLIP", text });
    manualInput.value = "";
  }
});

// Clear all
clearAllBtn.addEventListener("click", () => {
  chrome.storage.local.set({ clips: [] });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.clips) {
    renderClips();
  }
});

renderClips();