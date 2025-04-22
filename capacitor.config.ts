import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ammucare.app',
  appName: 'Ammucare',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#999999",
      splashFullScreen: true,
      splashImmersive: true
    },
    Keyboard: {
      resize: "body",
      resizeOnFullScreen: true
    },
    StatusBar: {
      style: "DARK",
   //   backgroundColor: "#ffffff",
  //    overlaysWebView: false
    }
  }
};

export default config;
