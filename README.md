# Annadaan Mobile App

This is a React TypeScript application that has been converted to a mobile app using Capacitor.

## Development Setup

### Prerequisites

- Node.js 20.0.0 or higher
- For Android development:
  - Android Studio
  - Java Development Kit (JDK) 11 or higher
  - Android SDK
- For iOS development:
  - macOS
  - Xcode
  - CocoaPods

### Install Dependencies

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

### Building the Web App

To build the web app:

```bash
npm run build
```

## Capacitor Commands

### Sync with Capacitor

After making changes to your web app, build it and sync with Capacitor:

```bash
npm run cap:build
```

Or just sync the changes:

```bash
npm run cap:sync
```

### Open Native IDE

To open the Android project in Android Studio:

```bash
npm run cap:open:android
```

To open the iOS project in Xcode (macOS only):

```bash
npm run cap:open:ios
```

### Run on Device/Emulator

To run the app on an Android device or emulator:

```bash
npm run cap:run:android
```

To run the app on an iOS simulator (macOS only):

```bash
npm run cap:run:ios
```

## Mobile App Structure

The mobile app is built using Capacitor, which allows the React web app to run inside a native webview on Android and iOS. The app includes:

- Native plugins for app lifecycle, keyboard, haptics, and status bar
- Mobile-specific styling and layout adjustments
- Proper handling of safe areas and notches
- Mobile-friendly touch feedback

## Testing

Make sure to test your app thoroughly on both Android and iOS devices to ensure a consistent user experience across platforms.

## Notes for Mobile Development

1. **Android Development**:
   - The Android project is located in the `android` directory
   - You can customize Android-specific settings in `android/app/src/main/AndroidManifest.xml`
   - Native code can be added in `android/app/src/main/java/com/ammucare/app/`

2. **iOS Development** (requires macOS):
   - The iOS project is located in the `ios` directory
   - You can customize iOS-specific settings in `ios/App/App/Info.plist`
   - Native code can be added in the Xcode project

3. **Capacitor Configuration**:
   - The main configuration file is `capacitor.config.ts`
   - You can customize app ID, name, and plugin settings in this file

## Troubleshooting

If you encounter any issues with Capacitor, try:

1. Clean and rebuild the project:
   ```bash
   npm run build
   npx cap sync
   ```

2. For Android, try cleaning the Gradle build:
   - Open Android Studio
   - Go to Build > Clean Project
   - Rebuild the project

3. For iOS, try cleaning the Xcode build:
   - In Xcode, go to Product > Clean Build Folder
   - Rebuild the project