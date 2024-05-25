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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
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
  let {
    authenticatedUser,
    users,
    usersNotFollowed,
    followingUsers,
    pendingFriendRequests,
  } = store;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("suggestions");
  const [disableInfiniteScroll, setDisableInfiniteScroll] =
    useState<boolean>(false);
  const [_usersNotFollowed, setUsersNotFollowed] = useState<User[]>([]);

  async function searchNext($event: CustomEvent<void>) {
    const lastUser = usersNotFollowed.slice(-1)[0];
    const users = await store.doGetUsersNotFollowed(undefined, lastUser);

    if (usersNotFollowed.length < 10) {
      // Remplacer 10 par le nombre d'utilisateurs que vous voulez par page
      setDisableInfiniteScroll(true);
    }

    setUsersNotFollowed([..._usersNotFollowed, ...users]);
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  }

  const handleSegmentChange = (event: CustomEvent) => {
    setUsersNotFollowed([]);
    setSelectedSegment(event.detail.value);
  };

  useEffect(() => {
    console.log("test");
    setUsersNotFollowed(usersNotFollowed);
  }, [usersNotFollowed]);

useEffect(() => {
  const unsubscribes: { [key: string]: any } = {};

  const FetchAllUserSuggestions = async () => {
    unsubscribes["suggestions"] = await store.doGetUsersNotFollowed();
  };

  const FetchAllUserFriends = async () => {
    unsubscribes["friends"] = await store.doGetUsersNotFollowed("follow");
  };

  const FetchAllUserRequest = async () => {
    unsubscribes["requests"] = await store.doGetUsersNotFollowed("Requests");
  };

  if (selectedSegment == "suggestions") FetchAllUserSuggestions();
  else if (selectedSegment == "friends") FetchAllUserFriends();
  else if (selectedSegment == "requests") FetchAllUserRequest();

  return () => {
    if (unsubscribes[selectedSegment]) {
      unsubscribes[selectedSegment]();
    }
  };
}, [selectedSegment, searchTerm]);

  const handleFollowUser = async (user: User) => {
    await store.doFollowUser(user);
  };

  const handleFriendRequest = async (_userId: string, accepted: Boolean) => {
    console.log(_userId, accepted);

    if (accepted) await store.doAcceptFriendRequest(_userId);
    else await store.doRejectFriendRequest(_userId);
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
              {_usersNotFollowed.map((user: any) => (
                <IonItem key={user.uid}>
                  <IonAvatar slot="start">
                    <img src={user.avatar} />
                  </IonAvatar>
                  <IonLabel>{user.username}</IonLabel>
                  <IonButton
                    fill="clear"
                    className="border rounded text-white w-1/4"
                    slot="end"
                    disabled={
                      user.status === "follow" || user.status === "pending"
                    }
                    onClick={() => {
                      if (user.status === "notFollowed") {
                        handleFollowUser(user.uid);
                      }
                    }}
                  >
                    {user.status === "follow"
                      ? "Ami"
                      : user.status === "pending"
                      ? "En attente"
                      : "Add"}
                  </IonButton>
                </IonItem>
              ))}
            </IonList>
            <IonInfiniteScroll
              threshold="10px"
              disabled={disableInfiniteScroll}
              onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}
            >
              <IonInfiniteScrollContent loadingText="Loading more users..."></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </>
        )}
        {selectedSegment == "friends" && (
          <IonList>
            {_usersNotFollowed.map((user: any) => (
              <IonItem key={user.uid}>
                <IonAvatar slot="start">
                  <img src={user.avatar} />
                </IonAvatar>
                <IonLabel>{user.username}</IonLabel>
              </IonItem>
            ))}
          </IonList>
        )}
        {selectedSegment == "requests" && (
          <IonList>
            {_usersNotFollowed.map((user: any) => (
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
                    handleFriendRequest(user.from, true);
                  }}
                >
                  Accept
                </IonButton>
                <IonButton
                  fill="clear"
                  className="border rounded text-white w-1/4"
                  slot="end"
                  onClick={() => {
                    handleFriendRequest(user.from, false);
                  }}
                >
                  Refuse
                </IonButton>
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
