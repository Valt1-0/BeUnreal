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
4. Do the capacitor sync: `npx cap sync`

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
