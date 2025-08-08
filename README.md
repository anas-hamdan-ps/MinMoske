# Mosque Finder App

A cross-platform mobile application that helps users find mosques in their area and view prayer times. Built with Flutter, AWS CDK, and DynamoDB.

## Features

- 🔍 **Search mosques** by city, country, or mosque name
- 📍 **Find nearby mosques** based on your location
- 🕌 **View prayer times** for each mosque
- 🌍 **Cross-platform** - works on iOS, Android, and Web

## Architecture

- **Frontend**: Flutter mobile app
- **Backend**: Express.js API with DynamoDB
- **Infrastructure**: AWS CDK (DynamoDB + API Gateway + Lambda)
- **Region**: eu-north-1 (Stockholm)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Flutter SDK
- AWS CLI configured
- Docker (for Lambda bundling)

### 1. Deploy Infrastructure

```bash
# Install dependencies
cd infra
npm install

# Bootstrap CDK (first time only)
npm run bootstrap

# Deploy to AWS
npm run deploy
```

This creates:
- DynamoDB table for mosque data
- API Gateway + Lambda for the backend API
- Outputs the API URL

### 2. Seed Database

```bash
# Install backend dependencies
cd backend
npm install

# Build TypeScript
npm run build

# Seed with sample mosque data
export AWS_REGION=eu-north-1 DYNAMO_TABLE=Mosques
npm run seed
```

### 3. Run the Flutter App

```bash
# Install Flutter dependencies
cd flutter_client
flutter pub get

# Run on available device
flutter run
```

## Running on Different Platforms

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
# Create an emulator
flutter emulators --create --name Pixel_4_API_30

# Start the emulator
flutter emulators --launch Pixel_4_API_30

# Run the app
flutter run -d android
```

### Physical Device
```bash
# List connected devices
flutter devices

# Run on specific device
flutter run -d <device-id>
```

## Location Testing

### iOS Simulator
1. Open Simulator
2. Features > Location > Custom Location
3. Set coordinates: `59.3326, 18.0649` (Stockholm)

### Android Emulator
1. Open Emulator
2. Three dots menu > Location
3. Set custom location to Stockholm

## API Testing

Test the deployed API:

```bash
# Search by text
curl "https://rsqygr2x1f.execute-api.eu-north-1.amazonaws.com/prod/api/mosques?q=Stockholm"

# Search by location
curl "https://rsqygr2x1f.execute-api.eu-north-1.amazonaws.com/prod/api/mosques?lat=59.33&lng=18.06&radiusKm=15"
```

## Development

### Backend Development

```bash
cd backend

# Run locally
export AWS_REGION=eu-north-1 DYNAMO_TABLE=Mosques
npm run dev

# Build for Lambda
npm run build
```

### Infrastructure Updates

```bash
cd infra

# Deploy changes
npm run deploy

# View CloudFormation stack
aws cloudformation describe-stacks --stack-name MosqueInfraStack --region eu-north-1
```

### Flutter Development

```bash
cd flutter_client

# Hot reload development
flutter run

# Build for production
flutter build apk  # Android
flutter build ios  # iOS
flutter build web  # Web
```

## Configuration

### API Base URL

Edit `flutter_client/lib/config.dart`:

```dart
// Production (deployed API)
const String apiBase = 'https://rsqygr2x1f.execute-api.eu-north-1.amazonaws.com/prod';

// Local development
const String apiBase = 'http://10.0.2.2:4000';  // Android emulator
const String apiBase = 'http://localhost:4000';   // iOS simulator
```

### Environment Variables

```bash
# Backend
export AWS_REGION=eu-north-1
export DYNAMO_TABLE=Mosques

# CDK
export CDK_DEFAULT_ACCOUNT=<your-aws-account>
export CDK_DEFAULT_REGION=eu-north-1
```

## Project Structure

```
gpt-5-MinMoske/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── app.ts          # Express server
│   │   ├── lambda.ts       # Lambda handler
│   │   ├── routes/         # API routes
│   │   └── seed.ts         # Database seeder
│   └── package.json
├── flutter_client/          # Flutter mobile app
│   ├── lib/
│   │   ├── main.dart       # App entry point
│   │   ├── config.dart     # API configuration
│   │   └── screens/        # UI screens
│   └── pubspec.yaml
└── infra/                  # AWS CDK infrastructure
    ├── lib/
    │   └── infra-stack.ts  # CDK stack definition
    └── package.json
```

## Troubleshooting

### Common Issues

1. **Lambda import errors**: Ensure using NodejsFunction in CDK
2. **Location permissions**: Add to AndroidManifest.xml and Info.plist
3. **API connection**: Check config.dart has correct API URL
4. **Emulator not found**: Install Android Studio or Xcode

### Logs

```bash
# Lambda logs
aws logs tail "/aws/lambda/MosqueInfraStack-ApiLambda*" --region eu-north-1

# Flutter logs
flutter logs
```

## Adding More Mosques

Edit `backend/src/seed.ts` and run:

```bash
cd backend
npm run seed
```

## Cleanup

```bash
# Destroy infrastructure
cd infra
npm run destroy

# Remove local builds
cd backend && rm -rf dist
cd flutter_client && flutter clean
```

## License

MIT License - feel free to use this project as a starting point for your own mosque finder app!

