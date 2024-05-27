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
import HomeTchatPage from "./pages/HomeTchatPage";
import FriendsPage from "./pages/FriendsPage";
import Camera from "./pages/Camera";

import { observer, MobXProviderContext } from "mobx-react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

import "@ionic/react/css/palettes/dark.always.css";

/* Theme variables */
import "./theme/variables.css";

import CreateTchatPage from "./pages/CreateTchatPage";
import TchatPage from "./pages/TchatPage";

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
        <Route path="/tchat" component={HomeTchatPage} exact={true} />
        <Route
          path="/tchat/create/new"
          component={CreateTchatPage}
          exact={true}
        />
        <Route path="/tchat/:id" component={TchatPage} exact={true} />
        <Route path={"/friends"} component={FriendsPage} exact={true} />
        <Route path={"/camera"} component={Camera} exact={true} />
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
