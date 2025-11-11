// Polyfills for Cloudflare Workers environment

// Mock MessageChannel since it's not available in Cloudflare Workers
if (typeof MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
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
  } as any;
}

// Ensure global is available
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}
