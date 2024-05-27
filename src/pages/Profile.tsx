import React from "react";
import { IonButton, IonContent, IonPage, IonToolbar } from "@ionic/react";
import * as FA6Icons from "react-icons/fa6";
import { MobXProviderContext } from "mobx-react";

interface User {
  username: string;
  email: string;
  // Add more user properties here
}

const Profile: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);

  // Assuming you have access to the connected user's data
  const user: User = {
    username: store.activeUser.username,
    email: store.activeUser.email,
    // ... other user properties
  };

  const handleLogout = () => {
    // Handle logout action
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
            {/* Assuming you have a profile picture URL in store.activeUser.profilePicture */}
            <img
              src={store.activeUser.profilePicture}
              alt="Profile"
              className="w-32 h-32"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 w-full mb-2"
              placeholder="Username"
              value={user.username}
              readOnly
            />
            <input
              type="email"
              className="border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 w-full mb-2"
              placeholder="Email"
              value={user.email}
              readOnly
            />
          </div>
          <IonButton onClick={handleLogout}>
            Déconnexion
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
