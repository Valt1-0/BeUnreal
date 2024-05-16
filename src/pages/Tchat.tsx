import React, { useState, useEffect } from "react";
import { IonContent, IonPage, IonButton, IonToolbar } from "@ionic/react";
import { MobXProviderContext, observer } from "mobx-react";
import { useParams } from "react-router-dom";
import { Message } from "../store/Firebase";
import { serverTimestamp } from "firebase/firestore";

const Tchat: React.FC = () => {
  interface MessageWithUsername extends Message {
    username?: string;
  }
  const { id } = useParams<{ id: string }>();
  const [message, setMessage] = useState("");
  const { store } = React.useContext(MobXProviderContext);
  const { authenticatedUser, tchatMessages } = store;
  const [imageFile, setImageFile] = useState<File | null>(null);
 const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTchatMessage = async () => {
      await store.getTchatMessages(id, authenticatedUser.uid);
    };
    fetchTchatMessage();
  }, []);

  useEffect(() => {
    console.log("message : ", message);
  }, [message]);

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
      await store.doSendMessage(id, newMessage,imageFile);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <div className="h-full flex flex-col justify-center items-center">
          <div className="w-screen overflow-y-scroll">
            {sortMessagesByTimestamp(tchatMessages).map(
              (msg: MessageWithUsername, index: number) => (
                <div
                  key={index}
                  className={`flex flex-col items-${
                    msg.senderId === authenticatedUser.uid ? "end" : "start"
                  }`}
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
          <div className="flex items-center py-20">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <input
              placeholder="Enter Message"
              className="mx-4 text-white border-2 border-white font-eloquiabold p-2 rounded-lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IonButton onClick={sendMessage}>Send</IonButton>
          </div>
        </div>
        {selectedImage && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-100"></div>
            <div className="bg-white p-4 rounded-lg relative">
              <img
                src={selectedImage}
                alt="Selected content"
                className="max-w-full h-auto"
              />
              <IonButton
                className="text-white absolute top-0 left-0 m-2"
                onClick={handleCloseModal}
              >
                Close
              </IonButton>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default observer(Tchat);
