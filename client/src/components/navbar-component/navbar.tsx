"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  const [activeTab, setActiveTab] = useState("null");

  return (
    <nav className="fixed bottom-4 left-3 right-3 h-16 rounded-2xl flex items-center z-50 overflow-hidden">
      <div className="absolute inset-0 bg-[#FACA92]/75 backdrop-opacity-40 -z-10" />

      <Link
        href="/calendrier"
        className=" hover:underline flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
        onClick={() => setActiveTab("calendar")}
      >
        <div className="relative w-12 h-12">
          <Image
            src={
              activeTab === "calendar"
                ? "/picto-calendrier-vert.svg"
                : "/picto-calendrier.svg"
            }
            alt="Calendrier"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      <button
        onClick={() => setActiveTab("cart")}
        className="flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
      >
        <div className="relative w-12 h-12">
          <Image
            src={
              activeTab === "cart"
                ? "/picto-panier-vert.svg"
                : "/picto-panier.svg"
            }
            alt="Panier"
            fill
            className="object-contain"
          />
        </div>
      </button>

      <button
        onClick={() => setActiveTab("search")}
        className="flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
      >
        <div className="relative w-12 h-12">
          <Image
            src={
              activeTab === "search"
                ? "/picto-loupe-vert.svg"
                : "/picto-loupe.svg"
            }
            alt="loupe"
            fill
            className="object-contain"
          />
        </div>
      </button>

      <button
        onClick={() => setActiveTab("favorites")}
        className="flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
      >
        <div className="relative w-12 h-12">
          <Image
            src={
              activeTab === "favorites"
                ? "/picto-etoile-vert.svg"
                : "/picto-etoile.svg"
            }
            alt="Favoris"
            fill
            className="object-contain"
          />
        </div>
      </button>

      <button
        onClick={() => setActiveTab("profile")}
        className="flex-1 h-full flex items-center justify-center active:scale-95 transition-transform"
      >
        <div className="relative w-12 h-12">
          <Image
            src={
              activeTab === "profile"
                ? "/picto-profil-vert.svg"
                : "/picto-profil.svg"
            }
            alt="Profil"
            fill
            className="object-contain"
          />
        </div>
      </button>
    </nav>
  );
}
