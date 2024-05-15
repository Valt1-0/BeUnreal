import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { observer, MobXProviderContext } from "mobx-react";

const Home: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser, initializationError } = store;

  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const handleCameraClick = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });
      // Mettre à jour photoUri avec l'URI de la photo
      setPhotoUri(photo.webPath);
    } catch (err) {
      console.error("Erreur lors de l'accès à la caméra : ", err);
    }
  };

  const handleLogout = async () => {
    try {
      await store.doLogout();
    } catch (e) {
      console.error("Erreur lors de la déconnexion : ", e);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="h-full flex flex-col justify-center items-center">
          <p className="text-3xl text-white font-eloquiabold">
            Bienvenue {authenticatedUser?.username}
          </p>
          <IonButton onClick={handleCameraClick}>Caméra</IonButton>
          {photoUri && <img src={photoUri} alt="Captured" />}

          <IonLabel> {authenticatedUser ? "login" : "not login"} </IonLabel>
          <IonButton onClick={handleLogout}>Logout</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
