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
      <IonContent>
        <p className="text-xl text-white font-eloquiabold text-center mt-4">
          BeUnreal
        </p>
        <div className="w-auto h-auto flex flex-col items-center justify-center mt-20">
          <p className="text-xl text-white font-eloquiabold">
            Quel est votre nom d'utilisateur ?
          </p>
          <input
            className="mt-4 p-3 border font-eloquiabold border-white rounded-md shadow-sm focus:border-white"
            type="text"
          />
          <button className="mt-32 px-4 py-3 bg-white text-black font-eloquiabold rounded-md hover:bg-black hover:text-white">
            Continuer
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
