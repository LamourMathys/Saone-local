"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BoxandBouton from "../../components/boxandbouton-component/boxandbouton";

interface EventData {
  id: number;
  title: string;
  location: string;
  event_date: string;
  description: string;
  event_photo?: string;
}

export default function Calendrier() {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setEvents(resJson.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const months = [
      "janv", "févr", "mars", "avril", "mai", "juin",
      "juil", "août", "sept", "oct", "nov", "déc"
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const getEventImagePath = (photo?: string) => {
    if (!photo) return "/placeholder.png";
    return photo;
  };

  return (
    <main className="w-full max-w-107.5 mx-auto min-h-screen bg-[#FAF6F0] pb-28">
      <div className="pt-4 px-4 flex flex-col gap-5">
        <BoxandBouton
          text="calendrier"
          boxColor="bg-[#FACA92]"
          buttonColor="bg-[#FACA92]"
        />

        <div className="w-full">
          <img
            src="/banniere-event.png"
            alt="Bannière Evénements"
            className="w-full h-auto"
          />
        </div>

        <div className="flex flex-col gap-8 mt-4">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="flex gap-4 items-center w-full">
                <div className="w-32.5 h-22.5 rounded-2xl overflow-hidden relative shrink-0 border border-[#FACA92]/20 shadow-sm">
                  <Image
                    src={getEventImagePath(event.event_photo)}
                    alt={event.title}
                    fill
                    unoptimized
                    priority
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 w-full">
                    <h3 className="text-xs font-bold text-[#8B362E] leading-tight flex-1">
                      {event.title} - {event.location}
                    </h3>
                    <div className="shrink-0 bg-[#9AA433] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg leading-tight text-center min-w-21.25 shadow-sm uppercase">
                      {formatEventDate(event.event_date)}
                    </div>
                  </div>
                  <p className="text-[10px] text-[#714143] leading-relaxed mt-2">
                    {event.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-[#9c787a] font-medium text-sm">
              Aucun événement de prévu pour le moment.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
