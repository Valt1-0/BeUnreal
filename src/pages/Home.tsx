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

import { Tooltip } from "react-tooltip";

function convertTimestamp(timestamp: {
  nanoseconds: number;
  seconds: number;
}): { date: string; time: string } {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );

  const optionsDate = { day: "2-digit", month: "2-digit", year: "numeric" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const formattedDate = date.toLocaleDateString([], optionsDate);
  const formattedTime = date.toLocaleTimeString([], optionsTime);

  return { date: formattedDate, time: formattedTime };
}

const Home = () => {
  const { store } = React.useContext(MobXProviderContext);
  const [myBeUnreal, setMyBeUnreal] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    store.doGetBeReal().then((r: any) => {
      setMyBeUnreal(r);
      console.log(r);
    });
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
          <div className="scroll-container">
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
        </div>
        <div className="mt-4">
          <IonText className="font-eloquiabold text-lg m-3">
            BeUnreal de mes amis
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
