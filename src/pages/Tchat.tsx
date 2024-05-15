import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonList,
  IonItem,
} from "@ionic/react";
import { MobXProviderContext, observer } from "mobx-react";
import { useParams } from 'react-router-dom';
import { Message } from "../store/Firebase";
import {serverTimestamp} from "firebase/firestore";

const Tchat: React.FC = () => {
    const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
    const { store } = React.useContext(MobXProviderContext);
    let { authenticatedUser, initializationError, tchatMessages } = store;


  useEffect(() => {
    const fetchTchatMessage = async  () => {
     await  store.getTchatMessages(id, authenticatedUser.uid);
    }
    fetchTchatMessage();

  }, []);

  useEffect(() => {
    console.log("message : ", message);
  }, [message]);
const sendMessage = async () => {
  const newMessage: Message = {
    senderId: authenticatedUser.uid,
    content: message,
    timestamp: serverTimestamp,
    type: "text",
  };

  try {
    await store.doSendMessage(id, newMessage);
    setMessage("");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <IonPage>
      <IonContent>
        <IonList>
          {tchatMessages.map((msg: string, index: number) => (
            <IonItem key={index}>{msg.content}</IonItem>
          ))}
        </IonList>
        <div className="flex items-center py-20">
          <input
            placeholder="Enter Message"
            className="flex-grow mr-4 text-black border-2 border-gray-300 p-2 rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IonButton onClick={sendMessage}>Send</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(Tchat);
