import React, { useContext } from "react";
import { IonButton, IonToolbar } from "@ionic/react";
import { MobXProviderContext } from "mobx-react";
import * as FAIcons from "react-icons/fa";

const Header = () => {
  const { store } = useContext(MobXProviderContext);
  let { authenticatedUser } = store;

  return (
    <IonToolbar color={"black"} className="bg-black">
      <div className="flex justify-around items-center">
        {authenticatedUser && (
          <div className="w-10 h-10 flex justify-center items-center">
            <IonButton fill="clear" routerLink="/friends">
              <FAIcons.FaUserFriends size={25} className="text-white" />
            </IonButton>
          </div>
        )}
        <p className="text-xl text-white font-eloquiabold text-center">
          BeUnreal1
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

export default Header;
