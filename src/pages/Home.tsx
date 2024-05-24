import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
} from "@capacitor-community/camera-preview";
import {
  IonContent,
  IonPage,
  IonButton,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import { MobXProviderContext } from "mobx-react";
import * as FAIcons from "react-icons/fa";
import "./home.css";
import Header from "../components/Header";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";

import { Toast } from "@capacitor/toast";


const Home: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser } = store;
  const [imageData, setImageData] = useState("");
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const cameraPreviewOptions = {
    position: "rear",
    lockAndroidOrientation: true,
    parent: "cameraPreview",
    className: "cameraLoader",
    toBack: true,
    x: 0,
    y: 200,
    width: window.screen.width,
    height: window.screen.height / 2,
  };
  console.log("imageData ", imageData);





   const nullEntry: any[] = [];
   const [notifications, setnotifications] = useState(nullEntry);

   useEffect(() => {
     registerNotifications();
     addListeners();
   }, []);

const addListeners = async () => {
  await PushNotifications.addListener("registration", (token) => {
    console.info("Registration token: ", token.value);
      showToast(`Push registration success ${token.value}`);
  });

  await PushNotifications.addListener("registrationError", (err) => {
    console.error("Registration error: ", err.error);
  });

  await PushNotifications.addListener(
    "pushNotificationReceived",
    (notification) => {
      console.log("Push notification received: ", notification);
    }
  );

  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (notification) => {
      console.log(
        "Push notification action performed",
        notification.actionId,
        notification.inputValue
      );
    }
  );
};

const registerNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    throw new Error("User denied permissions!");
  }

  await PushNotifications.register();
};

const getDeliveredNotifications = async () => {
  const notificationList = await PushNotifications.getDeliveredNotifications();
  console.log("delivered notifications", notificationList);
};
   const showToast = async (msg: string) => {
     await Toast.show({
       text: msg,
     });
   };






  useEffect(() => {
    CameraPreview.start(cameraPreviewOptions).then(() => {
      setIsCameraRunning(true);
      const bodyElement = document.querySelector("body");
      if (bodyElement) {
        bodyElement.classList.add("camera-active");
      }
       //document.body.style.backgroundColor = "transparent";
       document.documentElement.style.backgroundColor = "transparent";
    });
    return () => {
      CameraPreview.stop().then(() => {
        setIsCameraRunning(false);
        const bodyElement = document.querySelector("body");
        if (bodyElement) {
          bodyElement.classList.remove("camera-active");
        }
        // document.body.style.backgroundColor = "";
        // document.documentElement.style.backgroundColor = "";
      });
    };
  }, []);

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen={false}>
        <div id="cameraPreview" className="absolute flex w-full h-full justify-center ">
        </div>
        <div className="cameraLoader"></div>
        <div className="h-screen flex relative justify-center top-[25%] items-center  z-999">
          <button
            className="w-16 h-16 rounded-full flex text-white justify-center items-center border border-white  z-999"
            onClick={() => {
              if (isCameraRunning) {
                CameraPreview.capture({ quality: 100 }).then((result) => {
                  setImageData(result.value);
                });
              }
            }}
          >
            <FAIcons.FaCamera size={28} className="text-red" />{" "}
          </button>
        </div>
        {imageData && (
          <div className="h-screen flex justify-center items-center">
            <img
              src={`data:image/jpeg;base64,${imageData}`}
              alt="captured"
              className="h-64 w-64"
            />
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Home;
