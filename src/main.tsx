import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from './db/Firebase';
import { StatusBar, Style } from '@capacitor/status-bar';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log(analytics);


const setStatusBarStyleDark = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
};

setStatusBarStyleDark();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);