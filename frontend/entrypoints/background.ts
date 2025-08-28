import { defineBackground } from 'wxt/sandbox';

// Type for messages sent to/from the background script
type BackgroundMessage = {
  type: string;
  payload?: unknown;
};

// Type for the browser runtime API
declare const browser: {
  runtime: {
    onInstalled: {
      addListener: (callback: (details: { reason: string }) => void) => void;
    };
    onMessage: {
      addListener: (
        callback: (
          message: unknown,
          sender: { id?: string },
          sendResponse: (response?: unknown) => void
        ) => void | boolean
      ) => void;
    };
  };
};

export default defineBackground(() => {
  console.log('Background script loaded');

  // Listen for installation/update events
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      console.log('Extension installed');
    } else if (details.reason === 'update') {
      console.log('Extension updated');
    }
  });

  // Listen for messages from other parts of the extension
  browser.runtime.onMessage.addListener((message: unknown, _sender, _sendResponse) => {
    const msg = message as BackgroundMessage;
    console.log('Message received in background script:', msg);

    // Handle different message types
    if (msg && typeof msg === 'object' && 'type' in msg) {
      switch (msg.type) {
        case 'example':
          console.log('Example message received with payload:', msg.payload);
          break;
        default:
          console.warn('Unknown message type:', msg.type);
      }
    }
  });

  // Cleanup function
  return () => {
    console.log('Background script unloaded');
  };
});
