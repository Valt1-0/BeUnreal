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
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import "tailwindcss/tailwind.css";
import { MobXProviderContext,observer } from "mobx-react";
import Tchat from "../components/Tchat";
import * as  FirebaseService from "./../store/Firebase";
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

const [tchatID, setChatId] = useState<string | null>(null);
const [sendMessage, setSendMessage] = useState(false);
useEffect(() => {
    store.doGetFollowingUsers();
}, []);

useEffect(() => {
    const fetchChatId = async () => {
        const tchat = await store.getTchatIdByParticipants(
          selectedFriends.map((friend) => friend.uid)
        );
        const tChatID = tchat?.tChatID;
        setChatId(tChatID);
    }
    fetchChatId();
      setInputValue("");
    // Add your code here
}, [selectedFriends]);

const handleItemClick = (friend: { username: string; uid: string }) => {
  setSelectedFriends((prevSelectedFriends) => {
    const friendIndex = prevSelectedFriends.findIndex(
      (prevFriend) => prevFriend.uid === friend.uid
    );

    if (friendIndex !== -1) {
      // L'ami est déjà dans la liste, le supprimer
      return prevSelectedFriends.filter(
        (prevFriend) => prevFriend.uid !== friend.uid
      );
    } else {
      // L'ami n'est pas dans la liste, l'ajouter
      return [...prevSelectedFriends, friend];
    }
  });

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

const handleSendMessage = async (
  id: string,
  message: FirebaseService.Message,
  imageFile: File | null
) => {
const participants = [
  ...selectedFriends.map((friend) => friend.uid),
  authenticatedUser.uid,
];
   if(!tchatID)
    {
    const tchat = await store.doCreateChat(participants);
    await store.doSendMessage(tchat.id, message, imageFile);
    setChatId(tchat.id);
    }
    else 
    {
    await store.doSendMessage(tchatID, message, imageFile);
    }
    setSendMessage(true);
};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton className="text-white" defaultHref="/tchat" />
          </IonButtons>

          <IonTitle className="truncate">
            {!sendMessage
              ? "Nouvelle conversation"
              : selectedFriends.map((friend) => friend.username).join(", ")}
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={false}>
        <div className="h-full w-full flex flex-col">
          <div className="relative w-full items-center justify-center  max-h-52 grow-0">
            <div className="w-full items-center justify-center z-10 flex flex-col ">
              <div className="flex flex-wrap items-center justify-center z-10 ">
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
              <div className="justify-center items-center  w-56 z-10  ">
                {(inputValue !== "" || tchatID === null) && (
                  <IonList className="absolute w-56">
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
          <div className=" relative grow  ">
            {selectedFriends.length > 0 && (
              <Tchat
                id={tchatID || ""}
                authenticatedUser={authenticatedUser}
                tchatMessages={tchatMessages}
                getTchatMessages={store.getTchatMessages}
                doSendMessage={handleSendMessage}
              />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(CreateTchatPage);
