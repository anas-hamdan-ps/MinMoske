# Mosque Finder - Flutter Client

A cross-platform mobile application for finding mosques and viewing prayer times.

## Features

- 🔍 **Search Functionality**: Search mosques by city, country, or mosque name
- 📍 **Location-Based Search**: Find mosques near your current location
- 🕌 **Prayer Times**: View detailed prayer times for each mosque
- 📱 **Cross-Platform**: Works on iOS, Android, and Web

## Prerequisites

- Flutter SDK (latest stable version)
- Dart SDK
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Setup

### 1. Install Dependencies

```bash
flutter pub get
```

### 2. Configure API

Edit `lib/config.dart` to point to your API:

```dart
// Production API (deployed)
const String apiBase = 'https://rsqygr2x1f.execute-api.eu-north-1.amazonaws.com/prod';

// Local development
const String apiBase = 'http://10.0.2.2:4000';  // Android emulator
const String apiBase = 'http://localhost:4000';   // iOS simulator
```

## Running the App

### Check Available Devices

```bash
flutter devices
```

### Web (Chrome)

```bash
flutter run -d chrome
```

### iOS Simulator

```bash
# Open iOS Simulator
open -a Simulator

# Run the app
flutter run -d ios
```

### Android Emulator

```bash
# List available emulators
flutter emulators

# Create a new emulator (if none exist)
flutter emulators --create --name Pixel_4_API_30

# Launch emulator
flutter emulators --launch Pixel_4_API_30

# Run the app
flutter run -d android
```

### Physical Device

```bash
# Connect your device via USB
# Enable USB debugging (Android) or trust computer (iOS)

# List connected devices
flutter devices

# Run on your device
flutter run -d <device-id>
```

## Location Testing

### iOS Simulator
1. Open iOS Simulator
2. Go to **Features** > **Location** > **Custom Location**
3. Set coordinates: `59.3326, 18.0649` (Stockholm, Sweden)
4. The app will show nearby mosques based on this location

### Android Emulator
1. Open Android Emulator
2. Click the **three dots** menu
3. Select **Location**
4. Set custom location to Stockholm coordinates
5. The app will detect this location for nearby search

## App Usage

### Search Functionality
1. **Text Search**: Type a city, country, or mosque name in the search bar
   - Example: "Stockholm", "Malmö", "Sweden"
2. **Nearby Search**: Leave search empty and press "Go" to find mosques near your location

### Viewing Mosque Details
1. Tap on any mosque in the list
2. View prayer times:
   - Fajr (Dawn)
   - Dhuhr (Noon)
   - Asr (Afternoon)
   - Maghrib (Sunset)
   - Isha (Night)

## Development

### Hot Reload
The app supports hot reload during development:
```bash
flutter run
```
Then press `r` to hot reload or `R` to hot restart.

### Debug Mode
```bash
flutter run --debug
```

### Release Build
```bash
# Android
flutter build apk --release

# iOS
flutter build ios --release

# Web
flutter build web --release
```

## Dependencies

Key packages used:
- `http`: API communication
- `geolocator`: Location services
- `flutter_typeahead`: Search suggestions (if needed)

## Troubleshooting

### Common Issues

1. **"No pubspec.yaml found"**
   - Make sure you're in the `flutter_client` directory
   - Run `flutter pub get` to install dependencies

2. **Location not working**
   - Check device permissions
   - For simulators, set custom location as described above
   - Ensure location services are enabled

3. **API connection errors**
   - Verify `config.dart` has correct API URL
   - Check if backend is running/deployed
   - Test API directly with curl

4. **Emulator not found**
   - Install Android Studio for Android emulators
   - Install Xcode for iOS simulators
   - Create emulators using the commands above

### Debug Logs

```bash
# View Flutter logs
flutter logs

# Run with verbose logging
flutter run --verbose
```

## Project Structure

```
lib/
├── main.dart              # App entry point
├── config.dart            # API configuration
└── screens/
    ├── home.dart          # Main screen with search
    └── mosque_detail.dart # Mosque details screen
```

## Building for Production

### Android APK
```bash
flutter build apk --release
```
APK will be created at: `build/app/outputs/flutter-apk/app-release.apk`

### iOS IPA
```bash
flutter build ios --release
```
Then archive in Xcode for App Store distribution.

### Web
```bash
flutter build web --release
```
Web files will be in: `build/web/`

## Testing

### Unit Tests
```bash
flutter test
```

### Integration Tests
```bash
flutter test integration_test/
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see main project README for details.
