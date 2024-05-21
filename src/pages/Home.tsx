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
        <div id="cameraPreview" className="absolute flex w-full h-full ">
          {" "}
        </div>
        <div className="cameraLoader"></div>
        <div className="h-screen flex relative justify-center items-center  z-999">
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
