import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App } from '@capacitor/app';

/**
 * Check if the app is running in a native mobile environment
 */
export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Get the platform the app is running on
 */
export const getPlatform = (): string => {
  return Capacitor.getPlatform();
};

/**
 * Check if the app is running on iOS
 */
export const isIOS = (): boolean => {
  return Capacitor.getPlatform() === 'ios';
};

/**
 * Check if the app is running on Android
 */
export const isAndroid = (): boolean => {
  return Capacitor.getPlatform() === 'android';
};

/**
 * Set the status bar style
 */
export const setStatusBarStyle = async (style: 'dark' | 'light') => {
  if (!isNativePlatform()) return;
  
  try {
    await StatusBar.setStyle({
      style: style === 'dark' ? Style.Dark : Style.Light,
    });
  } catch (error) {
    console.error('Error setting status bar style:', error);
  }
};

/**
 * Show or hide the keyboard
 */
export const showKeyboard = async () => {
  if (!isNativePlatform()) return;
  
  try {
    await Keyboard.show();
  } catch (error) {
    console.error('Error showing keyboard:', error);
  }
};

/**
 * Hide the keyboard
 */
export const hideKeyboard = async () => {
  if (!isNativePlatform()) return;
  
  try {
    await Keyboard.hide();
  } catch (error) {
    console.error('Error hiding keyboard:', error);
  }
};

/**
 * Set up app back button event listener (Android)
 */
export const setupBackButtonHandler = (customHandler?: () => boolean) => {
  if (!isNativePlatform() || !isAndroid()) return;
  
  App.addListener('backButton', ({ canGoBack }) => {
    if (customHandler) {
      // If the custom handler returns true, we don't do anything else
      if (customHandler()) {
        return;
      }
    }
    
    if (canGoBack) {
      window.history.back();
    } else {
      App.exitApp();
    }
  });
  
  return () => {
    App.removeAllListeners();
  };
};

/**
 * Initialize Capacitor plugins
 */
export const initCapacitor = async () => {
  if (!isNativePlatform()) return;
  
  try {
    if (isAndroid()) {
      await StatusBar.setBackgroundColor({ color: '#ffffff' });
    }
    await setStatusBarStyle('dark');
  } catch (error) {
    console.error('Error initializing Capacitor:', error);
  }
};