import React, { useState } from "react";
import {
  IonButtons,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonToast,
  IonText,
  IonPage,
  IonContent,
} from "@ionic/react";
import { useHistory } from "react-router";
import { observer, MobXProviderContext } from "mobx-react";

interface ErrorInfo {
  showErrorToast: boolean;
  errMsg: string;
}

const LoginPage: React.FC = () => {
  const { store } = React.useContext(MobXProviderContext);
  let { isAuth, initializationError } = store;
  const history = useHistory();
  const [email, setEmail] = useState<string>("test@test.com");
  const [password, setPassword] = useState<string>("");

  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    showErrorToast: false,
    errMsg: "",
  });

  /**
   *
   */
  const _doLogin = async () => {
    try {
      let r = await store.doLogin(email, password);
      if (r.code) {
        throw r;
      }
      setErrorInfo({ showErrorToast: false, errMsg: "" });

      return history.push("/home");
    } catch (e: any) {
      setErrorInfo({ showErrorToast: true, errMsg: e.message });
      return false;
    }
  };

  return (
    <IonPage>
      <IonContent className="p-8">
        <IonText color="danger" className="p-8" style={{ fontWeight: "500" }}>
          {initializationError && initializationError.message}
        </IonText>
        <IonItem>
          <IonLabel position="floating">Email Address</IonLabel>
          <IonInput
            className="mt-6"
            type="email"
            onIonChange={(e) => {
              setEmail(e.detail.value!);
            }}
            name="email"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput
            className="mt-6"
            type="password"
            onIonChange={(e) => {
              setPassword(e.detail.value!);
            }}
            name="password"
          />
        </IonItem>
        <div className="flex flex-col  items-center">
          <IonButton
            fill="clear"
            className="mt-6 px-2 bg-white text-black font-eloquiabold rounded-md transform active:scale-90"
            onClick={(e) => {
              if (!e.currentTarget) {
                return;
              }
              e.preventDefault();
              _doLogin();
            }}
          >
            {isAuth ? "Logged In" : "Login"}
          </IonButton>
          <IonButton
            fill="clear"
            className="mt-6 px-2 bg-white text-black font-eloquiabold rounded-md transform active:scale-90"
            onClick={(e) => {
              e.preventDefault();
              history.push("/register");
            }}
          >
            Create Account
          </IonButton>
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

export default observer(LoginPage);
