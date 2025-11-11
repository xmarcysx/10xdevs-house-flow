
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { w as getDefaultExportFromCjs } from './astro/server_G7LsiH47.mjs';
import { c as requireReactDom } from './_@astro-renderers_BVqCE940.mjs';

var reactDomExports = requireReactDom();
const ReactDOM = /*@__PURE__*/getDefaultExportFromCjs(reactDomExports);

export { ReactDOM as R, reactDomExports as r };
