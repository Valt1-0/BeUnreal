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
  IonFooter,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { arrowForward } from "ionicons/icons";
interface User {
  id: string;
  username: string;
  avatar: string;
}

import { MobXProviderContext, observer } from "mobx-react";

const users: User[] = [
  // Remplissez cette liste avec vos utilisateurs
];

const FriendsPage: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser, users, usersNotFollowed, followingUsers } = store;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("suggestions");

  const handleSegmentChange = (event: CustomEvent) => {
    setSelectedSegment(event.detail.value);
  };

  useEffect(() => {
    const FetchAllUser = async () => {
      await store.doGetUsersNotFollowed();
    };
    FetchAllUser();
  }, [selectedSegment == "suggestions", searchTerm]);

  useEffect(() => {
    const FetchAllUser = async () => {
      await store.doGetFollowingUsers();
    };
    FetchAllUser();
  }, [selectedSegment == "friends"]);

  const handleFollowUser = async (user: User) => {
    await store.doFollowUser(user);
  };

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
        {selectedSegment == "suggestions" && (
          <>
            <IonInput
              value={searchTerm}
              onInput={(e: any) => setSearchTerm(e.detail.value!)}
              placeholder="Search by username"
              type="text"
            />
            <IonList>
              {usersNotFollowed.map((user: any) => (
                <IonItem key={user.uid}>
                  <IonAvatar slot="start">
                    <img src={user.avatar} />
                  </IonAvatar>
                  <IonLabel>{user.username}</IonLabel>
                  <IonButton
                    fill="clear"
                    className="border rounded text-white w-1/4"
                    slot="end"
                    onClick={() => {
                      handleFollowUser(user.uid);
                    }}
                  >
                    Add
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
          </>
        )}
        {selectedSegment == "friends" && (
            <IonList>
              {followingUsers.map((user: any) => (
                <IonItem key={user.uid}>
                  <IonAvatar slot="start">
                    <img src={user.avatar} />
                  </IonAvatar>
                  <IonLabel>{user.username}</IonLabel>
                </IonItem>
              ))}
            </IonList>
            )}
      </IonContent>
      <IonFooter className="flex w-[95%] bottom-4 justify-center items-center mx-auto">
        <IonSegment
          className="flex justify-around w-full"
          onIonChange={handleSegmentChange}
          value={selectedSegment}
        >
          <IonSegmentButton value="suggestions">
            <IonLabel>Suggestions</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="friends">
            <IonLabel>Amis</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="requests">
            <IonLabel>Demandes</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonFooter>
    </IonPage>
  );
};

export default observer(FriendsPage);
