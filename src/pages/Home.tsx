import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
} from "@capacitor-community/camera-preview";
import { IonContent, IonPage } from "@ionic/react";
import { MobXProviderContext } from "mobx-react";
import * as FAIcons from "react-icons/fa";
import Header from "../components/Header";
import { StatusBar } from "@capacitor/status-bar";

const Home: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser } = store;
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
    height: window.screen.height,
  };

  console.log("imageData ", imageData);

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
