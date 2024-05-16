import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraSampleOptions,
} from "@capacitor-community/camera-preview";
import { IonContent, IonPage, IonButton } from "@ionic/react";
import * as FAIcons from "react-icons/fa";

const Home: React.FC = () => {
  const [imageData, setImageData] = useState("");

  const cameraPreviewOptions: CameraPreviewOptions = {
    position: "rear",
    height: 400,
    width: 1080,
    lockAndroidOrientation: true,
  };

  CameraPreview.start(cameraPreviewOptions);

  return (
    <IonPage>
      <IonContent>
        <div id="cameraPreview">
          {/* <button
            onClick={() => {
              CameraPreview.stop();
            }}
          >
            Stop Camera
          </button> */}
          <div className="h-screen flex justify-center items-center">
            <button
              className="w-16 h-16 rounded-full flex justify-center items-center border border-white bg-transparent"
              onClick={() => {
                CameraPreview.capture({ quality: 100 }).then((result) => {
                  setImageData(result.value);
                });
              }}
            >
              <FAIcons.FaCamera size={28} className="text-white" />{" "}
              {/* Render the FaCamera icon with size 28 and white color */}
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
