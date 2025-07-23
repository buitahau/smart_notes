// Background script for Smart Notes Chrome extension

// Listen for installation event
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Extension was installed
    console.log('Smart Notes extension installed');
    
    // Set up default data
    chrome.storage.local.get(['notes'], (result) => {
      if (!result.notes) {
        // Initialize with empty array if no notes exist
        chrome.storage.local.set({ notes: [] });
      }
    });
    
    // Open the welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html#/welcome')
    });
  } else if (details.reason === 'update') {
    // Extension was updated
    console.log('Smart Notes extension updated');
  }
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request: { type: string }, _sender, sendResponse: (response?: any) => void) => {
  if (request.type === 'GET_NOTES') {
    // Handle request to get notes
    chrome.storage.local.get(['notes'], (result) => {
      if (sendResponse) {
        sendResponse({ notes: result.notes || [] });
      }
    });
    return true; // Indicates we want to send a response asynchronously
  }
  
  // Add more message handlers as needed
  return false;
});

// Context menu setup
chrome.runtime.onInstalled.addListener(() => {
  // Create a context menu item for selected text
  chrome.contextMenus.create({
    id: 'addToSmartNotes',
    title: 'Add to Smart Notes',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'addToSmartNotes' && info.selectionText) {
    // Get the selected text
    const selectedText = info.selectionText.trim();
    
    // Open the popup or a new tab with the selected text
    chrome.tabs.create({
      url: chrome.runtime.getURL(`index.html#/new?text=${encodeURIComponent(selectedText)}`)
    });
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open_note') {
    // Open the extension popup
    chrome.action.openPopup();
  } else if (command === 'quick_note') {
    // Open a quick note window
    chrome.windows.create({
      url: chrome.runtime.getURL('index.html#/quick-note'),
      type: 'popup',
      width: 400,
      height: 500
    });
  }
});

// Listen for tab updates to inject content scripts if needed
chrome.tabs.onUpdated.addListener((tabId) => {
  // Example: Inject content script on certain pages
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['content.js']
  });
});

// Keep the service worker alive
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
