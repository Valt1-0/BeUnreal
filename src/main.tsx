import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "mobx-react";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Store } from "./store";
import { StatusBar } from "@capacitor/status-bar";

const store = new Store();

StatusBar.setBackgroundColor({ color: "#121212" });

// Call the element loader before the render call
defineCustomElements(window);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
