import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="h-full flex flex-col justify-center items-center">
          <p className="text-3xl text-white font-eloquiabold">Bienvenue</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
