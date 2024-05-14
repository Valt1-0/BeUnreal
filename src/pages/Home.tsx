import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import React, { useState } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";

const Home: React.FC = () => {
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

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="h-full flex flex-col justify-center items-center">
          <p className="text-3xl text-white font-eloquiabold">Bienvenue</p>
          <IonButton onClick={handleCameraClick}>Caméra</IonButton>
          {photoUri && <img src={photoUri} alt="Captured" />}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
