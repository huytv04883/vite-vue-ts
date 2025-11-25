export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isDesktop: boolean;
  isPWA: boolean;
  isSafari: boolean;
  isChrome: boolean;
  browserName: string;
  osVersion: string;
  canUseWebPush: boolean;
}

export const detectDevice = (): DeviceInfo => {
  const ua = navigator.userAgent;
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMobile = isIOS || isAndroid;
  const isDesktop = !isMobile;

  // Check if running as PWA
  const isPWA =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://');

  // Browser detection
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  const isChrome = /Chrome/.test(ua) && !isSafari;

  // Get browser name
  let browserName = 'Unknown';
  if (isChrome) browserName = 'Chrome';
  else if (isSafari) browserName = 'Safari';
  else if (/Firefox/.test(ua)) browserName = 'Firefox';
  else if (/Edge/.test(ua)) browserName = 'Edge';

  // Get OS version (for iOS)
  let osVersion = '';
  if (isIOS) {
    const match = ua.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
      osVersion = `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`;
    }
  }

  // Check if Web Push is supported
  const canUseWebPush = checkWebPushSupport(isIOS, isPWA);

  return {
    isIOS,
    isAndroid,
    isMobile,
    isDesktop,
    isPWA,
    isSafari,
    isChrome,
    browserName,
    osVersion,
    canUseWebPush,
  };
};

const checkWebPushSupport = (isIOS: boolean, isPWA: boolean): boolean => {
  // Check basic Web Push API support
  const hasBasicSupport =
    'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

  if (!hasBasicSupport) {
    return false;
  }

  // iOS requires PWA mode and iOS 16.4+
  if (isIOS) {
    if (!isPWA) {
      return false; // iOS Safari tab doesn't support Web Push
    }

    // Check iOS version
    const match = navigator.userAgent.match(/OS (\d+)_(\d+)/);
    if (match) {
      const majorVersion = parseInt(match[1], 10);
      const minorVersion = parseInt(match[2], 10);

      // iOS 16.4+ supports Web Push in PWA mode
      if (majorVersion > 16 || (majorVersion === 16 && minorVersion >= 4)) {
        return true;
      }
    }

    return false;
  }

  // Android and Desktop browsers generally support Web Push
  return true;
};

export const getDeviceCapabilities = (device: DeviceInfo) => {
  return {
    supportsWebPush: device.canUseWebPush,
    supportsServiceWorker: 'serviceWorker' in navigator,
    supportsNotifications: 'Notification' in window,
    supportsPWA: device.isPWA || (!device.isIOS && device.isMobile),
    needsPWAInstall: device.isIOS && !device.isPWA,
    recommendedAction: getRecommendedAction(device),
  };
};

const getRecommendedAction = (device: DeviceInfo): string => {
  if (device.canUseWebPush) {
    return 'enable_notifications';
  }

  if (device.isIOS && !device.isPWA) {
    return 'install_pwa';
  }

  if (device.isIOS && device.isPWA) {
    const match = navigator.userAgent.match(/OS (\d+)_(\d+)/);
    if (match) {
      const majorVersion = parseInt(match[1], 10);
      if (majorVersion < 16 || (majorVersion === 16 && parseInt(match[2], 10) < 4)) {
        return 'update_ios';
      }
    }
  }

  return 'not_supported';
};

export const logDeviceInfo = (device: DeviceInfo) => {
  console.group('🔍 Device Information');
  console.log('Platform:', device.isIOS ? 'iOS' : device.isAndroid ? 'Android' : 'Desktop');
  console.log('Browser:', device.browserName);
  console.log('OS Version:', device.osVersion || 'N/A');
  console.log('Running as PWA:', device.isPWA ? '✅' : '❌');
  console.log('Web Push Support:', device.canUseWebPush ? '✅' : '❌');

  const capabilities = getDeviceCapabilities(device);
  console.log('Recommended Action:', capabilities.recommendedAction);
  console.groupEnd();

  return capabilities;
};
