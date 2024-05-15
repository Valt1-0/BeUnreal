import React, { useEffect, useState } from "react";
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraSampleOptions,
} from "@capacitor-community/camera-preview";
import { IonContent, IonPage, IonButton } from "@ionic/react";

const Home: React.FC = () => {
  const [imageData, setImageData] = useState("");

  const cameraPreviewOptions: CameraPreviewOptions = {
    position: "rear",
    height: 1920,
    width: 1080,
  };

  CameraPreview.start(cameraPreviewOptions);

  return (
    <IonPage>
      <IonContent>
        <div className="h-full flex flex-col justify-center items-center">
          <div id="cameraView" className="cameraView w-34 h-34 border-red-500"></div>

          <button
            className="px-4 py-3 bg-white text-black font-eloquiabold rounded-md"
            onClick={() => {
              CameraPreview.start({
                parent: "content",
                toBack: true,
                position: "front",
              });
            }}
          >
            Show Front Camera Preview
          </button>
          <button
            className="px-4 py-3 bg-white text-black font-eloquiabold rounded-md"
            onClick={() => {
              CameraPreview.start({
                parent: "content",
                toBack: true,
                position: "rear",
              });
            }}
          >
            Show Rear Camera Preview
          </button>
          <button
            className="px-4 py-3 bg-white text-black font-eloquiabold rounded-md"
            style={{ zIndex: "99999" }}
            onClick={() => {
              CameraPreview.stop();
            }}
          >
            Stop
          </button>
          <button
            className="px-4 py-3 bg-white text-black font-eloquiabold rounded-md"
            style={{ zIndex: "99999" }}
            onClick={() => {
              CameraPreview.flip();
            }}
          >
            Flip
          </button>
          <button
            className="px-4 py-3 bg-white text-black font-eloquiabold rounded-md"
            style={{ zIndex: "99999" }}
            onClick={async () => {
              const cameraSampleOptions: CameraSampleOptions = {
                quality: 50,
              };

              const result = await CameraPreview.captureSample(
                cameraSampleOptions
              );
              setImageData(`data:image/jpeg;base64,${result.value}`);
            }}
          >
            Capture Sample
          </button>
          {imageData ? (
            <div>
              <img width="100px" src={imageData} alt="Most Recent" />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
