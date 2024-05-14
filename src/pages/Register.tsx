import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonToast,
  IonLabel,
} from "@ionic/react";

import React, { useState } from "react";

import { MobXProviderContext, observer } from "mobx-react";
import { useHistory } from "react-router";
const Register: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  const history = useHistory();
  const [username, setUsername] = useState<any>();
  const [email, setEmail] = useState<any>();
  const [password, setPassword] = useState<any>();
  const [confirmPassword, setConfirmPassword] = useState<any>();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);

  interface ErrorInfo {
    showErrorToast: boolean;
    errMsg: string;
  }

  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    showErrorToast: false,
    errMsg: "",
  });

  const _doCreateAccount = async () => {
    try {
      let r = await store.doCreateUser({
        email,
        password,
        username,
      });

      if (r.code) {
        throw r;
      } else {
        history.replace("/home");
      }
    } catch (e: any) {
      console.log(e);
      setErrorInfo({ showErrorToast: true, errMsg: e.message });
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && username !== "") {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (currentStep === 2 && email !== "") {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (
      currentStep === 3 &&
      password !== "" &&
      password === confirmPassword
    ) {
      setCurrentStep((prevStep) => prevStep + 1);
      setFormData({ username, email, password });
    }
  };

  return (
    <IonPage>
      <IonContent className="overflow">
        <IonLabel className="text-xl text-white font-eloquiabold text-center mt-4">
          BeUnreal
        </IonLabel>
        <div className="w-100 h-auto flex flex-col items-center justify-center mt-20">
          {currentStep === 1 && (
            <>
              <IonLabel className="text-xl text-white font-eloquiabold">
                Quel est votre nom d'utilisateur ?
              </IonLabel>
              <IonInput
                className="bg-black mt-4 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="text"
                value={username}
                onIonChange={(e) => {
                  if (!e.detail.value) return;
                  setUsername(e.detail.value);
                }}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <IonLabel className="text-xl text-white font-eloquiabold">
                Quel est votre adresse e-mail ?
              </IonLabel>
              <IonInput
                className="bg-black mt-4 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="email"
                value={email}
                onIonChange={(e) => {
                  console.log(e.detail.value);
                  if (!e.detail.value) return;
                  setEmail(e.detail.value);
                }}
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <IonLabel className="text-xl text-white font-eloquiabold">
                Choisissez un mot de passe
              </IonLabel>
              <IonInput
                className="bg-black mt-4 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="password"
                value={password}
                onIonChange={(e) => {
                  if (!e.detail.value) return;
                  setPassword(e.detail.value);
                }}
              />
              <IonLabel className="text-xl text-white font-eloquiabold mt-4">
                Confirmez votre mot de passe
              </IonLabel>
              <IonInput
                className="bg-black mt-2 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="password"
                value={confirmPassword}
                onIonChange={(e) => {
                  if (!e.detail.value) return;
                  setConfirmPassword(e.detail.value);
                }}
              />
            </>
          )}
          <IonButton
            fill="clear"
            onClick={handleNextStep}
            className="mt-40 px-2 py-1 bg-white text-black font-eloquiabold rounded-md transform active:scale-90"
          >
            {currentStep === 3 ? "Terminer" : "Continuer"}
          </IonButton>
          {formData && (
            <div>
              <IonButton
                onClick={(e) => {
                  if (!e.currentTarget) return;
                  e.preventDefault();
                  _doCreateAccount();
                }}
                className="mt-4 px-4 py-3 bg-green-500 text-white font-eloquiabold rounded-md"
              >
                Soumettre
              </IonButton>
              <p className="flex flex-col text-white font-eloquiabold  justify-center items-center">
                {formData.username}
                {formData.email}
                {formData.password}
              </p>
            </div>
          )}
        </div>
        <div className="mt-40 flex flex-col justify-center items-center">
          <ul className="steps">
            <li
              data-content={currentStep >= 1 ? "✓" : "?"}
              className={`step font-eloquiabold text-white ${
                currentStep >= 1 && "text-green-500"
              }`}
            >
              Username
            </li>
            <li
              data-content={currentStep >= 2 ? "✓" : "?"}
              className={`step font-eloquiabold text-white ${
                currentStep >= 2 && "text-green-500"
              }`}
            >
              Email
            </li>
            <li
              data-content={currentStep >= 3 ? "✓" : "?"}
              className={`step font-eloquiabold text-white ${
                currentStep >= 3 && "text-green-500"
              }`}
            >
              Password
            </li>
          </ul>
        </div>
        <IonToast
          color="danger"
          isOpen={errorInfo.showErrorToast}
          onDidDismiss={() =>
            setErrorInfo({ showErrorToast: false, errMsg: "" })
          }
          message={errorInfo.errMsg}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default observer(Register);
