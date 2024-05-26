# BeUnreal

## Description
BeUnreal is an Ionic app that utilizes the Capacitor plugin to provide camera and geolocation functionality.

## Features
- Capture photos using the device's camera
- Retrieve the user's current location using geolocation

## Installation
1. Clone the repository: `git clone https://github.com/your-username/BeUnreal.git`
2. Navigate to the project directory: `cd BeUnreal`
3. Install the dependencies: `npm install`

## Usage
1. Build the app for your desired platform:
    - For iOS: `ionic capacitor build ios`
    - For Android: `ionic capacitor build android`
2. Open the project in the respective platform's development environment:
    - For iOS: `npx cap open ios`
    - For Android: `npx cap open android`
3. Run the app on a simulator or physical device using the development environment.

## Configuration
To configure the camera and geolocation features, follow these steps:

### Camera
1. Install the Capacitor Camera plugin: `npm install @capacitor/camera`
2. Import the Camera plugin in your code: `import { Camera } from '@capacitor/camera';`
3. Use the Camera plugin's methods to capture photos.

### Geolocation
1. Install the Capacitor Geolocation plugin: `npm install @capacitor/geolocation`
2. Import the Geolocation plugin in your code: `import { Geolocation } from '@capacitor/geolocation';`
3. Use the Geolocation plugin's methods to retrieve the user's current location.

## Contributing
Contributions are welcome! If you have any suggestions or improvements, please submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).