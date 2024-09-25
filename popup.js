document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({ action: "popupOpened" });
  });
  
  window.addEventListener('blur', () => {
    window.close();
  });