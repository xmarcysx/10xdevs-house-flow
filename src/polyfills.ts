// Polyfills for Cloudflare Workers environment

// Force define MessageChannel globally to prevent React from using it
Object.defineProperty(globalThis, 'MessageChannel', {
  value: class MessageChannel {
    port1: any;
    port2: any;

    constructor() {
      this.port1 = {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        close: () => {},
      };
      this.port2 = {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        close: () => {},
      };
    }
  },
  writable: false,
  enumerable: false,
  configurable: false
});

// Ensure global is available
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}

// Also set it directly on globalThis just in case
globalThis.MessageChannel = globalThis.MessageChannel || class MessageChannel {
  port1: any;
  port2: any;

  constructor() {
    this.port1 = {
      postMessage: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      close: () => {},
    };
    this.port2 = {
      postMessage: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      close: () => {},
    };
  }
};
