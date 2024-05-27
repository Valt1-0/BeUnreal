import React, { useState, useEffect, useRef } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonToolbar,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import { MobXProviderContext, observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { Message } from "../store/Firebase";
import { serverTimestamp } from "firebase/firestore";
import { Keyboard } from "@capacitor/keyboard";
interface TchatProps {
  id: string;
  authenticatedUser: any;
  tchatMessages: Message[];
  getTchatMessages: (id: string, uid: string) => Promise<void>;
  doSendMessage: (
    id: string,
    message: Message,
    imageFile: File | null
  ) => Promise<void>;
}
const Tchat: React.FC<TchatProps> = ({
  id,
  authenticatedUser,
  tchatMessages,
  getTchatMessages,
  doSendMessage,
}) => {
  interface MessageWithUsername extends Message {
    username?: string;
  }
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [bottom, setBottom] = useState(0);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInput = React.useRef<HTMLInputElement>(null);

  console.log("tchatMesasge ", tchatMessages);


useEffect(() => {
  scrollToBottom();
},[bottom]);

// useEffect(() => {
//   const handleShow = (info: any) => {
//     setBottom(info.keyboardHeight);
//     setTimeout(scrollToBottom, 300); // Ajoutez un délai
//   };
//   const handleHide = () => {
//     setBottom(0);
//     setTimeout(scrollToBottom, 300); // Ajoutez un délai
//   };

//   Keyboard.addListener("keyboardDidShow", handleShow);
//   Keyboard.addListener("keyboardDidHide", handleHide);

//   return () => {
//     Keyboard.removeAllListeners();
//   };
// }, []);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [tchatMessages]);

  useEffect(() => {
    const fetchTchatMessage = async () => {
      await getTchatMessages(id, authenticatedUser.uid);
    };
    fetchTchatMessage();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Fonction pour trier les messages par timestamp
  const sortMessagesByTimestamp = (messages: Message[]) => {
    return messages.slice().sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp.seconds - b.timestamp.seconds;
      }
      return 0;
    });
  };

  // Fonction pour formater le timestamp en heure HH:MM
  const formatTimestamp = (timestamp: any) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fonction pour envoyer un message
  const sendMessage = async () => {
    const newMessage: Message = {
      senderId: authenticatedUser.uid,
      content: message,
      type: imageFile ? "image" : "text",
    };

    try {
      await doSendMessage(id, newMessage, imageFile);
      setMessage("");
      setImageFile(null);
      if (fileInput.current) {
        fileInput.current.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="absolute flex flex-col h-full w-full justify-between">
      <div className="flex flex-col overflow-y-scroll  grow-0">
        {tchatMessages &&
          sortMessagesByTimestamp(tchatMessages).map(
            (msg: MessageWithUsername, index: number) => (
              <div
                key={index}
                className={`flex flex-col items-${
                  msg.senderId === authenticatedUser.uid ? "end" : "start"
                }`}
                ref={
                  index === tchatMessages.length - 1 ? endOfMessagesRef : null
                }
              >
                <div
                  className={`chat ${
                    msg.senderId === authenticatedUser.uid
                      ? "chat-end"
                      : "chat-start"
                  }`}
                >
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {msg.senderId === authenticatedUser.uid
                      ? "You"
                      : msg?.username}
                  </div>
                  {msg.type === "image" ? (
                    <div className="chat-bubble">
                      <img
                        src={msg.content}
                        alt="Message content"
                        className="w-64 h-64 object-contain cursor-pointer"
                        onClick={() => handleImageClick(msg.content)}
                      />
                    </div>
                  ) : (
                    <div className="chat-bubble">{msg.content}</div>
                  )}
                  <div className="chat-footer">
                    <time className="text-xs opacity-50">
                      {formatTimestamp(msg.timestamp)}
                    </time>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
      <div className=" flex max-h-28 w-full bg-black bottom-0">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInput}
        />
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          ref={fileInput}
        />
        <IonTextarea
          rows={1}
          autoGrow={true}
          fill="solid"
          placeholder="Aa"
          className="mx-4 text-white border-2 border-white font-eloquiabold p-2 rounded-lg"
          value={message}
          onIonInput={(e) => setMessage(e.detail.value!)}
        ></IonTextarea>
        {/* <input
            placeholder="Aa"
            className="mx-4 text-white border-2 border-white font-eloquiabold p-2 rounded-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          /> */}
        <IonButton className="h-10" onClick={sendMessage}>
          Send
        </IonButton>
      </div>
    </div>
  );
};

export default observer(Tchat);
