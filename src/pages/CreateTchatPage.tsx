import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonIcon,
  IonInput,
  InputChangeEventDetail,
} from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import "tailwindcss/tailwind.css";
import { MobXProviderContext,observer } from "mobx-react";
import Tchat from "./Tchat";

const CreateTchatPage: React.FC = () => {
    const {store} = React.useContext(MobXProviderContext);
    const { followingUsers, authenticatedUser, tchatMessages } = store;
  const [selectedFriends, setSelectedFriends] = useState<
    Array<{ username: string; uid: string }>
  >([]);
  const [highlightedFriend, setHighlightedFriend] = useState<{
    username: string;
    uid: string;
  } | null>(null);
const [inputValue, setInputValue] = useState("");

const [chatId, setChatId] = useState<string | null>(null);

useEffect(() => {
    store.doGetFollowingUsers();
}, []);

useEffect(() => {
    const fetchChatId = async () => {
        const chatId = await store.getTchatIdByParticipants(selectedFriends.map((friend) => friend.uid));
        console.log(chatId);
        setChatId(chatId);
    }
    fetchChatId();
    // Add your code here
}, [selectedFriends]);

  const handleItemClick = (friend: { username: string; uid: string }) => {

    setSelectedFriends((prevSelectedFriends) => [
      ...prevSelectedFriends,
      friend,
    ]);
    setHighlightedFriend(null);

  };

  const handleDelete = (friendToDelete: { username: string; uid: string }) => {
    setSelectedFriends((prevSelectedFriends) =>
      prevSelectedFriends.filter((friend) => friend.uid !== friendToDelete.uid)
    );
    setHighlightedFriend(null);
  };

const handleInput = (e: CustomEvent<InputChangeEventDetail>) => {
  setInputValue(e.detail.value || "");
};

const handleKeyDown = (e: React.KeyboardEvent) => {

      if (e.key === "Backspace" && highlightedFriend) {
        handleDelete(highlightedFriend);
      } else if (
        e.key === "Backspace" &&
        selectedFriends.length > 0 &&
        inputValue === ""
      ) {
        setHighlightedFriend(selectedFriends[selectedFriends.length - 1]);
      }
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Créer un chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={false}>
        <div className="max-h-full h-full w-full grid grid-rows-1  ">
          <div className="flex absolute  w-full items-center justify-center h-10">
            <div className="absolute items-center justify-center z-10 ">
              <div className="flex items-center w-full">
                <IonLabel className="whitespace-nowrap">à :</IonLabel>
                {selectedFriends.map((friend, index) => (
                  <IonChip
                    key={index}
                    color={
                      highlightedFriend && highlightedFriend.uid === friend.uid
                        ? "primary"
                        : undefined
                    }
                  >
                    <IonLabel>{friend.username}</IonLabel>
                    <IonIcon
                      icon={closeCircle}
                      onClick={() => handleDelete(friend)}
                    />
                  </IonChip>
                ))}
                <IonInput
                  value={inputValue}
                  onIonInput={handleInput}
                  placeholder=" Rechercher"
                  onKeyDown={handleKeyDown}
                  className="flex-shrink flex-basis-0 w-auto"
                />
              </div>
              <div>
                {(inputValue !== "" || chatId === null) && (
                  <IonList className="absolute w-full z-10">
                    {followingUsers.map(
                      (
                        friend: { username: any; uid: string },
                        index: React.Key | null | undefined
                      ) => (
                        <IonItem
                          color={
                            selectedFriends.some(
                              (friendItem) =>
                                friendItem.username === friend.username
                            )
                              ? "primary"
                              : undefined
                          }
                          aria-hidden="true"
                          key={index}
                          onClick={() => handleItemClick(friend)}
                        >
                          <IonLabel>{friend.username}</IonLabel>
                        </IonItem>
                      )
                    )}
                  </IonList>
                )}
              </div>
            </div>
          </div>
          <div className="h-full w-full max-h-full flex">
            {chatId && (
              <Tchat
                id={chatId}
                authenticatedUser={authenticatedUser}
                tchatMessages={tchatMessages}
                getTchatMessages={store.getTchatMessages}
                doSendMessage={store.doSendMessage}
              />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(CreateTchatPage);
