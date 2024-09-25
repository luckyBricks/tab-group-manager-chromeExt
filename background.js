let popupWindow = null;

chrome.commands.onCommand.addListener((command) => {
  if (command === "_execute_action") {
    togglePopup();
  }
});

function togglePopup() {
  if (popupWindow) {
    chrome.windows.remove(popupWindow.id);
    popupWindow = null;
  } else {
    chrome.windows.getCurrent((window) => {
      chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 320,
        height: 480,
        top: window.top,
        left: window.left + window.width - 320,
        focused: true
      }, (createdWindow) => {
        popupWindow = createdWindow;
      });
    });
  }
}

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (popupWindow && windowId !== popupWindow.id) {
    chrome.windows.remove(popupWindow.id);
    popupWindow = null;
  }
});