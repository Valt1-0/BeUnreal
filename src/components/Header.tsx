import React, { useContext, useEffect, useState } from "react";
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { MobXProviderContext, observer } from "mobx-react";
import { autorun } from "mobx";
import * as FAIcons from "react-icons/fa";

const Header = () => {
  const { store } = useContext(MobXProviderContext);
  let { authenticatedUser } = store;
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);
const [showPopover, setShowPopover] = useState<{
  open: boolean;
  event: React.MouseEvent<HTMLImageElement, MouseEvent> | undefined;
}>({
  open: false,
  event: undefined,
});


  useEffect(() => {
    store.doGetPendingFriendRequestsRealtime();
    const disposer = autorun(() => {
      setPendingFriendRequests(store.pendingFriendRequestsRealtime.length);
    });

    // Cleanup function
    return () => {
      disposer();
    };
  }, [store]);

  return (
    <IonToolbar
      color={"black"}
      className="bg-[#121212] flex justify-between items-center relative"
    >
      {authenticatedUser && (
        <IonButtons slot="start" className="flex items-center">
          <IonButton fill="clear" routerLink="/friends" routerDirection="back">
            <FAIcons.FaUserFriends size={25} className="text-white" />
            {pendingFriendRequests > 0 && (
              <IonBadge color={"danger"}>{pendingFriendRequests}</IonBadge>
            )}
          </IonButton>
        </IonButtons>
      )}
      <IonTitle className="font-eloquiabold text-white text-center absolute inset-0 flex items-center justify-center">
        BeUnreal
      </IonTitle>
      {authenticatedUser && (
        <IonButtons slot="end" className="flex items-center">
          <IonButton fill="clear" routerLink="/tchat" routerDirection="forward">
            <FAIcons.FaCommentDots size={25} className="text-white" />
            {pendingFriendRequests > 0 && (
              <IonBadge color={"danger"}>{pendingFriendRequests}</IonBadge>
            )}
          </IonButton>
          <div className="w-10 h-10 rounded-full flex justify-center items-center ml-2">
            <img
              className="rounded-full"
              src={`https://robohash.org/${authenticatedUser?.username}.png`}
              alt="avatar"
              onClick={(e) => {
                e.persist();
                setShowPopover({ open: true, event: e });
              }}
            />
            <IonPopover
              isOpen={showPopover.open}
              event={showPopover.event}
              onDidDismiss={() =>
                setShowPopover({ open: false, event: undefined })
              }
            >
              <IonList>
                <IonItem detail={true} button onClick={() => console.log("Profil clicked")}>
                  <IonLabel>Profil</IonLabel>
                </IonItem>
                <IonItem detail={false}  button onClick={() => store.doLogout()}>
                  <IonLabel>Logout</IonLabel>
                </IonItem>
              </IonList>
            </IonPopover>
          </div>
        </IonButtons>
      )}
    </IonToolbar>
  );
};

export default observer(Header);
