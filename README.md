# BeUnreal

## Description

BeUnreal is an Ionic app that utilizes the Capacitor plugin to provide camera and geolocation functionality.

## Features

- Capture photos using the device's camera
- Chat with other users, sending messages and images in group or one-on-one conversations
- Retrieve the user's location using geolocation
- Perform CRUD operations on user data

## Installation

1. Clone the repository: `git clone https://github.com/Valt1-0/BeUnreal.git`
2. Navigate to the project directory: `cd BeUnreal`
3. Install the dependencies: `npm install`
4. Setup Vite build : `npm run build`
4. Do the capacitor sync: `npx cap sync`

## Configuration

Before running the application, you need to configure your environment variables with your Firebase data:


1. Create a `.env` file in the root of your project.
2. Add the following information, replacing the placeholders with your Firebase data:

```
VITE_API_KEY="Your Firebase API Key"
VITE_AUTH_DOMAIN="Your Firebase Auth Domain"
VITE_PROJECT_ID="Your Firebase Project ID"
VITE_STORAGE_BUCKET="Your Firebase Storage Bucket"
VITE_MESSAGING_SENDER_ID="Your Firebase Messaging Sender ID"
VITE_APP_ID="Your Firebase App ID"
VITE_MEASUREMENT_ID="Your Firebase Measurement ID"
```
## Firebase Configuration

In addition to setting up the environment variables, you also need to configure Firebase for the Android platform:

1. Follow the instructions in the [Firebase Android setup documentation](https://firebase.google.com/docs/android/setup?hl=fr).
2. Download the `google-services.json` file and place it in the `android/app` directory of your project.

Please note that the `google-services.json` file contains sensitive information and should not be included in your Git repository. Make sure it is added to your `.gitignore` file.

## Usage
1. Launch the app
   - For Web: `ionic serve`
   - For Android: You can use USB Debugging and run `ionic cap run android --external -livereload`

## Usage using Android Studio
1. Build the app for your desired platform:
   - For iOS: `ionic capacitor build ios`
   - For Android: `ionic capacitor build android`
2. Open the project in the respective platform's development environment:
   - For iOS: `npx cap open ios`
   - For Android: `npx cap open android`
3. Run the app on a simulator or physical device using the development environment.

## Testing

This project uses Cypress for end-to-end testing. Follow these steps to run the tests:

1. Ensure that the application is running locally: `ionic serve`
2. Open Cypress Test Runner: `npx cypress open`
3. Click on the test file you want to run.

Cypress will run the tests in a new browser window and display the results in the Test Runner.

For more information on using Cypress, refer to the [Cypress documentation](https://docs.cypress.io/guides/overview/why-cypress).