// Constant key for storing the hub window ID
const HUB_WINDOW_ID_KEY = 'princeext_hub_window_id';

// Helper function to create the window and save the ID
function createNewHubWindow(hubUrl) {
    chrome.windows.create({
        url: hubUrl,
        type: "popup",
        width: 800, 
        height: 600,
        focused: true
    }, (newWindow) => {
        // Save the new window ID for future use
        if (newWindow && newWindow.id) {
            chrome.storage.local.set({ [HUB_WINDOW_ID_KEY]: newWindow.id });
        }
    });
}

// The main toggle logic using persistent storage
function toggleHubWindow() {
    const hubUrl = chrome.runtime.getURL("hub_window.html");
    
    // 1. Get the last known window ID from storage
    chrome.storage.local.get([HUB_WINDOW_ID_KEY], (data) => {
        const storedId = data[HUB_WINDOW_ID_KEY];

        if (storedId) {
            // 2. Try to get the specific window using the stored ID
            chrome.windows.get(storedId, { populate: false }, (existingWindow) => {
                
                if (chrome.runtime.lastError || !existingWindow) {
                    // Window not found (closed by user or failed). Clean up storage and create a new one.
                    chrome.storage.local.remove(HUB_WINDOW_ID_KEY, () => {
                        console.warn("Hub window not found, ID cleaned. Creating new one.");
                        createNewHubWindow(hubUrl);
                    });
                    return;
                }

                // 3. Window is found. Perform the focus/toggle logic.
                if (existingWindow.focused) {
                    // It is focused -> Close it and clean up storage.
                    chrome.windows.remove(existingWindow.id, () => {
                        chrome.storage.local.remove(HUB_WINDOW_ID_KEY);
                    });
                } else {
                    // It is open but not focused -> Focus it and bring it to the front.
                    chrome.windows.update(existingWindow.id, { focused: true });
                }
            });
        } else {
            // 4. No ID found in storage -> Create new window.
            createNewHubWindow(hubUrl);
        }
    });
}


chrome.commands.onCommand.addListener((command) => {
  if (command === "launch_overlay") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;

      // Check to prevent injection on special pages like chrome://newtab/
      if (tabs[0].url.startsWith('chrome://') || tabs[0].url.startsWith('about:')) return; 

      chrome.scripting
        .executeScript({
          target: { tabId: tabs[0].id },
          files: ["inject.js"],
        })
        .catch((err) => console.error("Injection failed:", err));
    });
  } 
  
  // FINAL MODIFICATION: Call the robust toggle function
  if (command === "launch_desktop_hub") {
    toggleHubWindow();
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