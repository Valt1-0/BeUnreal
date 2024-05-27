import React, { useContext, useEffect, useState } from "react";
import { IonBadge, IonButton, IonButtons, IonTitle, IonToolbar } from "@ionic/react";
import { MobXProviderContext, observer } from "mobx-react";
import { autorun } from "mobx";
import * as FAIcons from "react-icons/fa";

const Header = () => {
  const { store } = useContext(MobXProviderContext);
  let { authenticatedUser } = store;
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);
  useEffect(() => {
    store.doGetPendingFriendRequestsRealtime();
    const disposer = autorun(() => {
      setPendingFriendRequests(store.pendingFriendRequestsRealtime.length);
    });

    // Cleanup function
    return () => {
      disposer();
    };
  }, []);

  return (
    <IonToolbar>
      {authenticatedUser && (
        <IonButtons slot="start">
          <IonButton fill="clear" routerLink="/friends" routerDirection="back">
            <FAIcons.FaUserFriends size={25} className="text-white" />
            {pendingFriendRequests > 0 && (
              <IonBadge color={"danger"}>{pendingFriendRequests}</IonBadge>
            )}
          </IonButton>
        </IonButtons>
      )}
      <IonTitle>BeUnreal</IonTitle>
      {authenticatedUser && (
        <IonButtons slot="end">
          <IonButton fill="clear" routerLink="/tchat" routerDirection="forward">
            <FAIcons.FaCommentDots size={25} className="text-white" />
            {pendingFriendRequests > 0 && (
              <IonBadge color={"danger"}>{pendingFriendRequests}</IonBadge>
            )}
          </IonButton>
          <div className="w-10 h-10 rounded-full flex justify-center items-center">
            <img
              className="rounded-full"
              src={`https://robohash.org/${authenticatedUser?.username}.png`}
              alt="avatar"
            />
          </div>
        </IonButtons>
      )}
    </IonToolbar>
  );
};

export default observer(Header);
