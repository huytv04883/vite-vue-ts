import { warn } from 'vue';

/** Convert a URL-safe base64 string to a Uint8Array */
export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

/** Log custom messages */
export const LOGs = {
  info: (message: unknown) => {
    console.log('%cINFO:', 'color: blue; font-weight: bold;', message);
  },
  error: (message: unknown) => {
    console.error('%cERROR:', 'color: red; font-weight: bold;', message);
  },
  success: (message: unknown) => {
    console.log('%cSUCCESS', 'color: green; font-weight: bold;', message);
  },
  warn: (message: unknown) => {
    warn('%cWARNING:', 'color: orange; font-weight: bold;', message);
  },
};
