import {
  IonButton,
  IonContent,
  IonPage,
  IonToast,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import * as FAIcons from "react-icons/fa";
import { MobXProviderContext, observer } from "mobx-react";
import { useHistory } from "react-router";

const Tchat: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser, initializationError,tchats } = store;


  useEffect(() => {
    const fetchTchats = async () => {
      try {
         await store.getTchats();
      } catch (e) {
        console.error("Erreur lors de la récupération des tchats : ", e);
      }
    };
    fetchTchats();
  }, []);



  return (
    <IonPage >
      <IonHeader translucent={true}>
        <IonToolbar >
          <IonButtons slot="start">
            <IonBackButton defaultHref="/your-default-route" />
          </IonButtons>

          <IonButtons slot="end">
            <IonButton
              fill="clear"
              routerLink="/tchat/create/new"
              routerDirection="forward"
            >
              <FAIcons.FaCommentMedical size={25} className="text-white" />
            </IonButton>
          </IonButtons>
          <IonTitle>Discussions</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {tchats.map((tchat: any) => (
            <IonItem
              key={tchat.id}
              lines="none"
              routerLink={`/tchat/${tchat.id}`}
            >
              <IonAvatar slot="start">
                <img
                  src={
                    tchat.avatarUrl
                      ? tchat.avatarUrl
                      : `https://robohash.org/${authenticatedUser.username}.png`
                  }
                />
              </IonAvatar>
              <IonLabel
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tchat.participants
                  .map((user: any) => user.username)
                  .join(", ")}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default observer(Tchat);