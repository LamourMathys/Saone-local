"use client";

import { useState } from "react";
import Image from "next/image";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const hasSeenPopup = localStorage.getItem("hasSeenMainMenuPopup");
      return !hasSeenPopup;
    }
    return false;
  });

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenMainMenuPopup", "true");
  };

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-9999 p-4">
      <div className="relative bg-white w-full max-w-sm rounded-2xl p-4 shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="absolute top-2 right-2 w-14 h-14 z-10 cursor-pointer">
          <Image
            src="/picto-croix.png"
            alt="picto croix rouge"
            fill
            className="object-contain"
            onClick={handleClose}
          />
        </div>

        <div className="flex flex-col gap-4 text-sm text-[#714143] font-baloo mt-4">
          <div className="relative w-full h-32 rounded-xl overflow-hidden">
            <Image
              src="/plus-sur-l'asso-banniere.webp"
              alt="banniere plus sur l'association"
              fill
              className="object-cover"
            />
          </div>

          <p className="leading-relaxed">
            Bienvenue sur SaôneLocal, une association qui rapproche ceux qui
            produisent et ceux qui consomment 🌱 Notre mission est simple :
            permettre à chacun d&lsquo;accéder facilement à des produits locaux,
            frais et de qualité, tout en soutenant les agriculteurs près de chez
            soi.
          </p>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="relative w-full h-36 rounded-xl overflow-hidden">
              <Image
                src="/plus-sur-l'asso-boulangerie.webp"
                alt="banniere plus sur l'asso boulangerie"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="font-bold text-xs text-[#6E763B]">
                L&lsquo;asso en quelques mots
              </h4>
              <ul className="text-xs space-y-0.5 font-medium text-[#714143]">
                <li>proximité</li>
                <li>partage</li>
                <li>confiance</li>
                <li>local</li>
                <li>authenticité</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <p className="text-xs leading-relaxed">
              Grâce à notre application, vous pouvez découvrir les producteurs
              de votre région, échanger avec eux et acheter directement leurs
              produits, en toute simplicité. SaôneLocal, c&lsquo;est bien plus
              qu&lsquo;un service : c&lsquo;est une communauté engagée pour une
              alimentation plus responsable, plus humaine et plus proche de nos
              territoires.
            </p>
            <div className="relative w-full h-36 rounded-xl overflow-hidden">
              <Image
                src="/plus-sur-l'asso-selfie.webp"
                alt="banniere plus sur l'asso selfie"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
