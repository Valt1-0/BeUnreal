import { IonContent, IonPage } from "@ionic/react";
import React, { useState } from "react";

import { MobXProviderContext, observer } from "mobx-react";
import { useHistory } from "react-router";
const Register: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
    const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>(null);
  
  const [errorInfo, setErrorInfo] = useState({});

 const _doCreateAccount = async () => {
   try {
     let r = await store.doCreateUser({
       email,
       password,
       username
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

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
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

  const handleSubmit = () => {


    console.log("Form submitted with data:", formData);
  };

  return (
    <IonPage>
      <IonContent>
        <p className="text-xl text-white font-eloquiabold text-center mt-4">
          BeUnreal
        </p>
        <div className="w-auto h-auto flex flex-col items-center justify-center mt-20">
          {currentStep === 1 && (
            <>
              <p className="text-xl text-white font-eloquiabold">
                Quel est votre nom d'utilisateur ?
              </p>
              <input
                className="bg-black mt-4 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="text"
                value={username}
                onChange={handleUsernameChange}
              />
            </>
          )}
          {currentStep === 2 && (
            <>
              <p className="text-xl text-white font-eloquiabold">
                Quel est votre adresse e-mail ?
              </p>
              <input
                className="bg-black mt-4 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="email"
                value={email}
                onChange={handleEmailChange}
              />
            </>
          )}
          {currentStep === 3 && (
            <>
              <p className="text-xl text-white font-eloquiabold">
                Choisissez un mot de passe
              </p>
              <input
                className="bg-black mt-4 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              <p className="text-xl text-white font-eloquiabold mt-4">
                Confirmez votre mot de passe
              </p>
              <input
                className="bg-black mt-2 p-3 border font-eloquiabold border-white focus:border-white rounded-md shadow-sm"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
            </>
          )}
          <button
            onClick={handleNextStep}
            className="mt-40 px-4 py-3 bg-white text-black font-eloquiabold rounded-md"
          >
            {currentStep === 3 ? "Terminer" : "Continuer"}
          </button>
          {formData && (
            <div>
              <button
                onClick={() => {
                  _doCreateAccount();
                }}
                className="mt-4 px-4 py-3 bg-green-500 text-white font-eloquiabold rounded-md"
              >
                Soumettre
              </button>
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
      </IonContent>
    </IonPage>
  );
};

export default Register;
