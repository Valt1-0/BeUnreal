import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Provider } from "mobx-react";
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Store } from "./store";

const store = new Store();


// Call the element loader before the render call
defineCustomElements(window);

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
