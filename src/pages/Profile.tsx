import React, { useState } from "react";
import {
  IonButton,
  IonContent,
  IonPage,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import * as FA6Icons from "react-icons/fa6";
import { MobXProviderContext } from "mobx-react";
import { useHistory } from "react-router-dom";

const Profile: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  const {activeUser} = store;



  const [username, setUsername] = useState(activeUser.username);
  const [email] = useState(store.activeUser.email); // Email is not editable

  const history = useHistory();

  const [infoToast, setInfoToast] = useState<any>({
    showInfoToast: false,
    infoMsg: "",
  });

  // React component's method to handle the account update
  const updateAccount = async () => {
    try {
      const updateSuccess = await store.doUpdateUser({ username });

      if (!updateSuccess) {
        throw new Error("Update failed");
      } else {
        setInfoToast({ showInfoToast: true, infoMsg: "Account Updated" });
        setTimeout(() => {
          history.replace("/home");
        }, 2000);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  const deleteAccount = () => {
    try {
      const deleteSuccess = store.doDeleteUser();

      if (!deleteSuccess) {
        throw new Error("Delete failed");
      } else {
        setInfoToast({ showInfoToast: true, infoMsg: "Account Deleted" });
        setTimeout(() => {
          history.replace("/register");
        }, 2000);
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <IonPage>
      <IonToolbar>
        <IonButton fill="clear" routerLink="/home">
          <FA6Icons.FaArrowLeftLong size={25} color="white" />
        </IonButton>
      </IonToolbar>
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center justify-center">
          <div className="rounded-full overflow-hidden mb-4">
            {store.activeUser.profilePicture ? (
              <img
                src={store.activeUser.profilePicture}
                alt="Profile"
                className="rounded-full w-32 h-32"
              />
            ) : (
              <img
                className="rounded-full w-32 h-32"
                src={`https://robohash.org/${store.activeUser.username}.png`}
                alt="avatar"
              />
            )}
          </div>
          <div className="w-full max-w-xs mb-4 flex flex-col items-center">
            <input
              type="text"
              className="bg-[#121212] text-center focus:outline-none focus:border-white w-full mb-2 p-2 rounded"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="bg-gray-300 text-gray-600 text-center focus:outline-none w-full mb-2 p-2 rounded cursor-not-allowed"
              placeholder="Email"
              value={email}
              readOnly
              disabled
            />
          </div>
          <IonButton
            className="bg-white font-eloquiabold text-3x text-orange-500 rounded-lg"
            fill="clear"
            onClick={updateAccount}
          >
            Mettre à jour
          </IonButton>
          <IonButton
            className="absolute bottom-0 mb-24 text-2x bg-white font-eloquiabold text-red-500 rounded-lg mt-4"
            fill="clear"
            onClick={deleteAccount}
          >
            Supprimer
          </IonButton>
        </div>
      </IonContent>
      <IonToast
        className="text-center text-lg text-white font-eloquiabold"
        color="white"
        isOpen={infoToast.showInfoToast}
        onDidDismiss={() => setInfoToast({ showInfoToast: false, infoMsg: "" })}
        message={infoToast.infoMsg}
        duration={2000}
      />
    </IonPage>
  );
};

export default Profile;
