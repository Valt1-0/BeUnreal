import { IonButton, IonContent, IonPage, IonToast } from "@ionic/react";
import React, { useState, useEffect } from "react";

import { MobXProviderContext, observer } from "mobx-react";
import { useHistory } from "react-router";

const Tchat: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser, initializationError } = store;
  const [tchats, setTchats] = useState<any[]>([]);

  useEffect(() => {
    const fetchTchats = async () => {
      try {
        const tchat = await store.getTchats();
        console.log(tchat);
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
          <p className="text-3xl text-white font-eloquiabold">Bienvenue</p>
          <IonButton onClick={handleCreateTchat}>Create tchat</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(Tchat);
