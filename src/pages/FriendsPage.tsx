import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButtons,
  IonIcon,
} from "@ionic/react";
import { arrowForward } from "ionicons/icons";
interface User {
  id: string;
  username: string;
  avatar: string;
}

import { MobXProviderContext,observer } from "mobx-react";

const users: User[] = [
  // Remplissez cette liste avec vos utilisateurs
];

const FriendsPage: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser,users } = store;
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  const FetchAllUser = async () => {
    await store.getUsers(searchTerm);
  };
  FetchAllUser();
}, [searchTerm]);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"black"}>
          <IonButtons slot="end">
            <IonButton routerLink="/home">
              <IonIcon icon={arrowForward} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <IonInput
          value={searchTerm}
          onInput={(e: any) => setSearchTerm(e.detail.value!) }
          placeholder="Search by username"
          type="text"
        />
        <IonList>
          {users.map((user : any) => (
            <IonItem key={user.id}>
              <IonAvatar slot="start">
                <img src={user.avatar} />
              </IonAvatar>
              <IonLabel>{user.username}</IonLabel>
              <IonButton slot="end">Add</IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default observer(FriendsPage);
