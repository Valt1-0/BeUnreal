import React, { useContext, useEffect, useState } from "react";
import { IonBadge, IonButton, IonToolbar } from "@ionic/react";
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
    <IonToolbar color={"black"} className="bg-[#121212]">
      <div className="flex justify-around items-center">
        {authenticatedUser && (
          <div className="w-10 h-10 flex justify-center items-center">
            <IonButton
              fill="clear"
              routerLink="/friends"
              routerDirection="back"
            >
              <FAIcons.FaUserFriends size={25} className="text-white" />
              {pendingFriendRequests > 0 && (
                <IonBadge color={"danger"}>{pendingFriendRequests}</IonBadge>
              )}
            </IonButton>
          </div>
        )}
        <p className="text-xl text-white font-eloquiabold text-center">
          BeUnreal
        </p>
        {authenticatedUser && (
          <div className="w-10 h-10 rounded-full flex justify-center items-center">
            <img
              className="rounded-full"
              src={`https://robohash.org/${authenticatedUser?.username}.png`}
              alt="avatar"
            />
          </div>
        )}
      </div>
    </IonToolbar>
  );
};

export default observer(Header);
