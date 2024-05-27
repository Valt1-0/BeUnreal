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

const CreateTchatPage: React.FC = () => {
    const {store} = React.useContext(MobXProviderContext);
    const { followingUsers } = store;
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
      <IonContent fullscreen className="ion-padding">
        <div className="flex flex-wrap items-center">
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
        <IonList>
          {followingUsers.map(
            (
              friend: { username: any; uid: string },
              index: React.Key | null | undefined
            ) => (
              <IonItem
                color={
                  selectedFriends.some(
                    (friendItem) => friendItem.username === friend.username
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
      </IonContent>
    </IonPage>
  );
};

export default observer(CreateTchatPage);
