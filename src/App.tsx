import { Redirect, Route } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonLoading,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import LoginPage from "./pages/LoginPage";
import TchatPage from "./pages/TchatPage";
import { observer, MobXProviderContext, } from "mobx-react";
import { toJS, autorun } from "mobx";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";


/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "@ionic/react/css/palettes/dark.always.css";

/* Theme variables */
import "./theme/variables.css";
import Header from "./components/Header";
import Tchat from "./pages/Tchat";
import FriendsPage from "./pages/FriendsPage";
import { Toast } from "@capacitor/toast";

setupIonicReact();

const PrivateRoutes: React.FC = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/****** AUTH CREATE ACCOUNT */}
        <Route path="/login" component={LoginPage} exact={true} />
        <Route path="/register" component={Register} exact={true} />
        <Redirect to="/login" />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const PublicRoutes: React.FC = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/home" component={Home} />
        <Route path="/tchat" component={TchatPage} exact={true} />
        <Route path={"/tchat/:id"} component={Tchat} exact={true} />
        <Route path={"/friends"} component={FriendsPage} exact={true} />
        <Redirect to="/home" />
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

const App: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);

  return !store.authCheckComplete ? (
    <IonApp>
      <IonLoading message="Starting App..." />
    </IonApp>
  ) : (
    <IonApp>
      {store.authenticatedUser ? <PublicRoutes /> : <PrivateRoutes />}
    </IonApp>
  );
};

export default observer(App);
