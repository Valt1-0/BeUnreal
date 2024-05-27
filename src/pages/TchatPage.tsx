import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import "tailwindcss/tailwind.css";
import { MobXProviderContext, observer } from "mobx-react";
import Tchat from "../components/Tchat";
import { useParams } from "react-router";

const TchatPage: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  const { followingUsers, authenticatedUser, tchatMessages } = store;
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton className="text-white" defaultHref="/tchat" />
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={false}>
        <div className="h-full w-full flex flex-col">
          {id && (
            <Tchat
              id={id}
              authenticatedUser={authenticatedUser}
              tchatMessages={tchatMessages}
              getTchatMessages={store.getTchatMessages}
              doSendMessage={store.doSendMessage}
            />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(TchatPage);
