import {
  IonHeader,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
  IonImg,
  IonFooter,
} from "@ionic/react";
import Header from "../components/Header";
import React, { useEffect, useState } from "react";
import { IonButton, IonContent, IonIcon, IonPage } from "@ionic/react";
import { MobXProviderContext, observer } from "mobx-react";

import * as FAIcons from "react-icons/fa";

import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { isPlatform } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import { Tooltip } from "react-tooltip";
import { Toast } from "@capacitor/toast";

import { convertTimestamp } from "../functions/convertTimestamp";

const Home = () => {
  const { store } = React.useContext(MobXProviderContext);
  const [myBeUnreal, setMyBeUnreal] = useState<any>([]);
  const [followerBeUnReal, setFollowerBeUnReal] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);

  const showToast = async (msg: string) => {
    await Toast.show({
      text: msg,
    });
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

  useEffect(() => {
    store.doGetBeReal().then((b: any) => {
      setMyBeUnreal(b);
    });

    store.doGetFollowBeUnReal().then((b: any) => {
      setFollowerBeUnReal(b);
      console.log(b);
    });
  }, []);

  useEffect(() => {
    const getNearbyNonFollowedunBeReal = async () => {
      let coordinates = { coords: { latitude: 0, longitude: 0 } };
      if (isPlatform("hybrid")) {
        coordinates = await Geolocation.getCurrentPosition();
      }
      store
        .doGetNearbyNonFollowedunBeReal({
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
        })
        .then((r: any) => {
          console.log(r);
        });
    };
    checkLocationPermissions();
    getNearbyNonFollowedunBeReal();
  }, []);

  const cardData = [
    {
      title: "Card 1",
      subtitle: "Subtitle 1",
      text: "Some text for card 1",
    },
    {
      title: "Card 2",
      subtitle: "Subtitle 2",
      text: "Some text for card 2",
    },
    {
      title: "Card 3",
      subtitle: "Subtitle 3",
      text: "Some text for card 3",
    },
    {
      title: "Card 3",
      subtitle: "Subtitle 3",
      text: "Some text for card 3",
    },
    {
      title: "Card 3",
      subtitle: "Subtitle 3",
      text: "Some text for card 3",
    },
    // Add more card data here
  ];

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="mt-4">
          <IonText className="font-eloquiabold text-lg m-3">
            Mes BeUnreal
          </IonText>
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            pagination={{
              clickable: true,
            }}
          >
            {myBeUnreal.map((card: any, index: number) => {
              const { date, time } = convertTimestamp(card.timestamp);
              return (
                <SwiperSlide key={index}>
                  <IonCard>
                    <IonImg
                      src={card.url}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-1 flex justify-center items-center text-black bg-white bg-opacity-70 rounded-md shadow-lg">
                      <FAIcons.FaCalendarAlt className="mr-2" />
                      <Tooltip id={`tooltip-${index}`} place="top">
                        <p className="text-x font-eloquiabold">{date}</p>
                      </Tooltip>
                      <a
                        data-tooltip-id={`tooltip-${index}`}
                        data-tooltip-content={time}
                      >
                        <p className="text-x font-eloquiabold">{date}</p>
                      </a>
                    </div>
                  </IonCard>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="mt-4">
          <IonText className="font-eloquiabold text-lg m-3">
            BeUnreal de mes amis
          </IonText>
          <Swiper
            slidesPerView={3}
            spaceBetween={20}
            pagination={{
              clickable: true,
            }}
          >
            {followerBeUnReal.map(
              (followerBeUnrealArray: any[], arrayIndex: number) => {
                const lastBeUnreal = followerBeUnrealArray.sort(
                  (a, b) => b.timestamp - a.timestamp
                )[0];

                if (!lastBeUnreal) {
                  return null;
                }

                return (
                  <div key={arrayIndex}>
                    <h2>Follower {arrayIndex + 1}</h2>
                    <SwiperSlide key={arrayIndex}>
                      <IonCard>
                        <IonImg
                          src={lastBeUnreal.url}
                          style={{ width: "100%", height: "auto" }}
                        />
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-1 flex justify-center items-center text-black bg-white bg-opacity-70 rounded-md shadow-lg">
                          <p className="text-2x font-eloquiabold">
                            {lastBeUnreal.user.username}
                          </p>
                        </div>
                      </IonCard>
                    </SwiperSlide>
                  </div>
                );
              }
            )}
          </Swiper>
        </div>
        <div className="mt-4">
          <IonText className="font-eloquiabold text-lg m-3">
            Découvertes
          </IonText>
          <div className="scroll-container">
            <Swiper
              slidesPerView={3}
              spaceBetween={20}
              pagination={{
                clickable: true,
              }}
            >
              {cardData.map((card, index) => (
                <SwiperSlide key={index}>
                  <IonCard>
                    <IonImg
                      src="https://placehold.co/1440x2560"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <div className="absolute bottom-0 left-2 p-2 text-black bg-white rounded-md">
                      <p className="text-sm">{card.title}</p>
                    </div>
                  </IonCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        <div>
          <IonButton
            fill="clear"
            routerLink="/camera"
            className="fixed z-10 bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 border-4 border-white border-solid rounded-full flex items-center justify-center bg-transparent"
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default observer(Home);
