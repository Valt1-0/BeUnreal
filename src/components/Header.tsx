import React, { useContext } from "react";
import { IonToolbar } from "@ionic/react";
import { MobXProviderContext } from "mobx-react";
import * as FAIcons from "react-icons/fa";

const Header = () => {
  const { store } = useContext(MobXProviderContext);
  let { authenticatedUser } = store;

  return (
    <IonToolbar color={"black"}>
      <div className="flex justify-around items-center">
        <div className="w-10 h-10 flex justify-center items-center">
          <button>
            <FAIcons.FaUserFriends size={25} className="text-white" />
          </button>
        </div>
        <p className="text-xl text-white font-eloquiabold text-center">
          BeUnreal
        </p>
        <div className="w-10 h-10 rounded-full flex justify-center items-center">
          <img
            className="rounded-full"
            src={`https://robohash.org/${authenticatedUser.username}.png`}
            alt="avatar"
          />
        </div>
      </div>
    </IonToolbar>
  );
};

export default Header;
