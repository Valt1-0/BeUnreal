import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
} from "@capacitor-community/camera-preview";
import { IonContent, IonPage } from "@ionic/react";
import { MobXProviderContext } from "mobx-react";
import * as FAIcons from "react-icons/fa";
import Header from "../components/Header";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";

import { Toast } from "@capacitor/toast";

import { StatusBar } from "@capacitor/status-bar";

const Home: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  const [imageData, setImageData] = useState("");
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const cameraPreviewOptions: CameraPreviewOptions = {
    position: "rear",
    lockAndroidOrientation: true,
    parent: "cameraPreview",
    className: "cameraLoader",
    toBack: true,
    x: 0,
    y: 0,
    width: window.screen.width,
    height: window.screen.height / 2,
  };

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
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
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
      StatusBar.setOverlaysWebView({ overlay: true });
      document.body.style.backgroundColor = "transparent";
      document.documentElement.style.backgroundColor = "transparent";
    });

    return () => {
      CameraPreview.stop().then(() => {
        setIsCameraRunning(false);
        const bodyElement = document.querySelector("body");
        if (bodyElement) {
          bodyElement.classList.remove("camera-active");
        }
        StatusBar.setOverlaysWebView({ overlay: false });
      });
    };
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen={true}>
        <div id="cameraPreview">
          {imageData && (
            <div className="relative w-full h-full flex justify-center items-center">
              <button
                className="absolute top-4 left-4 text-white text-3xl"
                onClick={() => setImageData("")}
              >
                &times;
              </button>
              <img
                src={`data:image/jpeg;base64,${imageData}`}
                alt="captured"
                className="h-auto w-auto max-w-full max-h-full"
              />
            </div>
          )}
        </div>
        <div className="cameraLoader"></div>
        <button
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center"
          onClick={() => {
            if (isCameraRunning) {
              CameraPreview.capture({ quality: 100 }).then((result) => {
                setImageData(result.value);
              });
            }
          }}
        >
          <FAIcons.FaCamera size={28} />
        </button>
      </IonContent>
    </IonPage>
  );
};

export default Home;
