import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
} from "@capacitor-community/camera-preview";
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { MobXProviderContext } from "mobx-react";
import * as FAIcons from "react-icons/fa";
import Header from "../components/Header";
import {
  PushNotificationSchema,
  PushNotifications,
  Token,
  ActionPerformed,
} from "@capacitor/push-notifications";
import { Geolocation } from "@capacitor/geolocation";

import { Toast } from "@capacitor/toast";
import { isPlatform } from "@ionic/react";
import { StatusBar } from "@capacitor/status-bar";
import "./home.css";
import { sendSharp } from "ionicons/icons";
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
    enableZoom: true,
    width: window.screen.width,
    height: window.screen.height,
  };

  const nullEntry: any[] = [];
  const [notifications, setnotifications] = useState(nullEntry);

  useEffect(() => {
    if (isPlatform("hybrid")) {
      registerNotifications();
      addListeners();

      checkLocationPermissions();
    }
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

  const checkLocationPermissions = () => {
    Geolocation.requestPermissions().then((result) => {
      if (result.location === "granted") {
        console.log("Location permission granted");
      } else {
        showToast(
          "Location permission denied. Please enable it in the app settings."
        );
      }
    });
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
      <IonContent fullscreen={true} className="w-full h-full">
        {imageData ? (
          <div className="w-full h-full">
            <button
              className="absolute top-7 left-4 text-white text-3xl z-10"
              onClick={() => setImageData("")}
            >
              &times;
            </button>
            <img
              src={`data:image/jpeg;base64,${imageData}`}
              alt="captured"
              className=" absolute max-w-full max-h-full w-full h-full object-cover"
            />
          </div>
        ) : (
          <div id="cameraPreview"></div>
        )}
        {!imageData ? (
          <button
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 border-8 border-white border-solid rounded-full flex items-center justify-center bg-transparent"
            onClick={async () => {
              if (isCameraRunning) {
                CameraPreview.captureSample({
                  quality: 100,
                }).then((result) => {
                  setImageData(result.value);
                });
              }
            }}
          ></button>
        ) : (
          <div className="flex justify-end  pr-6">
            <IonButton
              className="absolute bottom-10 w-auto h-16 bg-black text-white rounded-full "
              onClick={async () => {
                let coordinates = { coords: { latitude: 0, longitude: 0 } };
                if (isPlatform("hybrid")) {
                  coordinates = await Geolocation.getCurrentPosition();
                }
                const save = await store.doSaveBeReal(
                  {
                    latitude: coordinates.coords.latitude,
                    longitude: coordinates.coords.longitude,
                  },
                  `data:image/jpeg;base64,${imageData}`
                );
                console.log(save);
                if (save) {
                  showToast("Image saved successfully");
                  setImageData("");
                } else {
                  showToast("Image save failed");
                }
              }}
              fill="clear"
            >
              Enregistrer
              <IonIcon icon={sendSharp} className="px-2" />
            </IonButton>
          </div>
        )}
        +{" "}
      </IonContent>
    </IonPage>
  );
};

export default Home;
