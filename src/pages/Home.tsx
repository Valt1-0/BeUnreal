import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraSampleOptions,
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

const Home: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { authenticatedUser } = store;
  const [imageData, setImageData] = useState("");
  const [isCameraRunning, setIsCameraRunning] = useState(false);

  const cameraPreviewOptions: CameraPreviewOptions = {
    position: "rear",
    height: 400,
    width: 1080,
    lockAndroidOrientation: true,
  };
console.log("imageData ", imageData);
  useEffect(() => {
    CameraPreview.start(cameraPreviewOptions).then(() => {
      setIsCameraRunning(true);
    });

    return () => {
      CameraPreview.stop().then(() => {
        setIsCameraRunning(false);
      });
    };
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={"black"}>
          <div className="flex justify-around items-center">
            {authenticatedUser && (
              <div className="w-10 h-10 flex justify-center items-center">
                <IonButton
                  fill="clear"
                  routerLink="/friends"
                  routerDirection="back"
                >
                  <FAIcons.FaUserFriends size={25} className="text-white" />
                </IonButton>
              </div>
            )}
            <p className="text-xl text-white font-eloquiabold text-center">
              BeUnreal
            </p>
            {authenticatedUser && (
              <div className="w-10 h-10 rounded-full flex justify-center items-center">
                <img
                  className="rounded-full"
                  src={`https://robohash.org/${authenticatedUser?.username}.png`}
                  alt="avatar"
                />
              </div>
            )}
          </div>
        </IonToolbar>
      </IonHeader>
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
                if (isCameraRunning) {
                  CameraPreview.capture({ quality: 100 }).then((result) => {
                    setImageData(result.value);
                  });
                }
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
