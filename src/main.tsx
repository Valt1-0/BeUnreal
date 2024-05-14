import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Provider } from "mobx-react";
import { Store } from "./store";


const setStatusBarStyleDark = async () => {
 // await StatusBar.setStyle({ style: Style.Dark });
};

const store = new Store();

//setStatusBarStyleDark();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
