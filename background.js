chrome.commands.onCommand.addListener((command) => {
  if (command === "launch_overlay") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          files: ["inject.js"],
        })
        .catch((err) => console.error("Injection failed:", err));
    });
  }
});

const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "fetchImageAsBase64") {
    fetch(request.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then(blobToBase64)
      .then((base64Url) => {
        sendResponse({
          success: true,
          dataUrl: base64Url,
        });
      })
      .catch((error) => {
        console.error(
          `PrinceExt Background Error: Failed to fetch ${request.url}`,
          error
        );
        sendResponse({
          success: false,
        });
      });
    return true;
  }
});