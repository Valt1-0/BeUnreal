import {
  IonButton,
  IonContent,
  IonPage,
  IonToast,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
} from "@ionic/react";
import React, { useState, useEffect } from "react";

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

  const handleCreateTchat = async () => {
    const tchat = await store.doCreateChat([authenticatedUser.uid]);
    console.log(tchat);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="h-full flex flex-col justify-center items-center">
          <IonButton onClick={handleCreateTchat}>Create tchat</IonButton>
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(Tchat);
