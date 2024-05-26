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

import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

const Home = () => {
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

export default Home;
