import { LOGs } from '@/utils/common';
import { detectDevice, getDeviceCapabilities } from '@/utils/device';

export type NotificationPermission = 'granted' | 'denied' | 'default';

export interface NotificationStatus {
  supported: boolean;
  permission: NotificationPermission;
  canRequest: boolean;
  needsPWAInstall: boolean;
  message: string;
}

/**
 * Check current notification status
 */
export const checkNotificationStatus = (): NotificationStatus => {
  const device = detectDevice();
  const capabilities = getDeviceCapabilities(device);

  // Check if Notification API is supported
  if (!('Notification' in window)) {
    return {
      supported: false,
      permission: 'denied',
      canRequest: false,
      needsPWAInstall: false,
      message: 'Your browser does not support notifications',
    };
  }

  // Check if Web Push is supported on this device
  if (!device.canUseWebPush) {
    if (capabilities.needsPWAInstall) {
      return {
        supported: false,
        permission: 'default',
        canRequest: false,
        needsPWAInstall: true,
        message: 'Please add this app to your home screen to enable notifications',
      };
    }

    return {
      supported: false,
      permission: 'denied',
      canRequest: false,
      needsPWAInstall: false,
      message: 'Notifications are not supported on this device',
    };
  }

  const permission = Notification.permission as NotificationPermission;

  return {
    supported: true,
    permission,
    canRequest: permission === 'default',
    needsPWAInstall: false,
    message: getPermissionMessage(permission),
  };
};

/**
 * Request notification permission from user
 */
export const requestNotificationPermission = async (): Promise<NotificationStatus> => {
  const status = checkNotificationStatus();

  // Cannot request if not supported
  if (!status.supported) {
    return status;
  }

  // Already granted or denied
  if (status.permission !== 'default') {
    return status;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);

    return {
      supported: true,
      permission: permission as NotificationPermission,
      canRequest: false,
      needsPWAInstall: false,
      message: getPermissionMessage(permission as NotificationPermission),
    };
  } catch (error) {
    LOGs.error(error);
    return {
      supported: true,
      permission: 'denied',
      canRequest: false,
      needsPWAInstall: false,
      message: 'Failed to request notification permission',
    };
  }
};

/**
 * Show a test notification
 */
export const showTestNotification = async (): Promise<boolean> => {
  const status = checkNotificationStatus();

  if (status.permission !== 'granted') {
    console.warn('⚠️ Cannot show notification: permission not granted');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification('Test Notification', {
      body: 'This is a test notification from Chat App',
      tag: 'Test-notification',
    });
    console.log('Test notification shown');
    return true;
  } catch (error) {
    console.error('Error showing test notification:', error);
    return false;
  }
};

/**
 * Get permission message for UI
 */
const getPermissionMessage = (permission: NotificationPermission): string => {
  switch (permission) {
    case 'granted':
      return 'Notifications are enabled';
    case 'denied':
      return 'Notifications are blocked. Please enable them in browser settings';
    case 'default':
      return 'Click to enable notifications';
    default:
      return 'Unknown notification status';
  }
};
