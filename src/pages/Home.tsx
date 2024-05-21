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

  const cameraPreviewOptions: CameraPreviewOptions = {
    position: "rear",
    height: window.innerHeight,
    width: window.innerWidth,
    lockAndroidOrientation: true,
    parent: "cameraPreview",
    className: "cameraPreview",
    toBack: true,
  };
  console.log("imageData ", imageData);
  useEffect(() => {
    CameraPreview.start(cameraPreviewOptions).then(() => {
      setIsCameraRunning(true);
      // document.body.style.backgroundColor = "transparent";
      // document.documentElement.style.backgroundColor = "transparent";
    });
    return () => {
      CameraPreview.stop().then(() => {
        setIsCameraRunning(false);
        // document.body.style.backgroundColor = "";
        // document.documentElement.style.backgroundColor = "";
      });
    };
  }, []);

  return (
    <IonPage>
      <Header />
      <div>
        <div id="cameraPreview" className="cameraPreview">
          <div className="h-screen flex justify-center items-center">
            <button
              className="w-16 h-16 rounded-full flex justify-center items-center border border-white bg-transparent"
              onClick={() => {
                if (isCameraRunning) {
                  CameraPreview.capture({ quality: 100 }).then((result) => {
                    setImageData(result.value);
                  });
                }
              }}
            >
              <FAIcons.FaCamera size={28} className="text-white" />{" "}
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
        </div>
      </div>
    </IonPage>
  );
};

export default Home;
