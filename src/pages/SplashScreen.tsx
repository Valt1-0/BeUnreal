import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

const SplashScreen: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="h-full flex flex-col justify-center items-center">
          <p className="text-xl text-white font-eloquiabold">BeUnreal</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
