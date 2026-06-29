"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header({ setActiveTab = (value: string) => {} }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLinkClick = (tab: string) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  return (
    <header className="relative h-20 flex items-center justify-between px-4 bg-[#fff5ea] z-50">
      <Link href="/" onClick={() => handleLinkClick("")}>
        <Image
          src="/SaoneLocal.png"
          alt="Saône Local Logo"
          width={80}
          height={80}
          className="object-contain"
          priority
        />
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col justify-between w-13 h-10 bg-[#FACA92] rounded-md p-1.5 relative z-50"
        >
          <span className="w-full h-1 bg-white rounded-full"></span>
          <span className="w-full h-1 bg-white rounded-full"></span>
          <span className="w-full h-1 bg-white rounded-full"></span>
        </button>

        {isOpen && (
          <div className="absolute -top-3 -right-3 w-48 bg-white/90 rounded-2xl shadow-xl pt-16 p-5 z-40">
            <nav className="flex flex-col items-end gap-4 text-lg font-medium text-[#714143]">
              <Link
                href="/connexion"
                onClick={() => handleLinkClick("connexion")}
              >
                se connecter
              </Link>
              <Link href="/favoris" onClick={() => handleLinkClick("favoris")}>
                favoris
              </Link>
              <Link href="/panier" onClick={() => handleLinkClick("panier")}>
                panier
              </Link>
              <Link
                href="/calendrier"
                onClick={() => handleLinkClick("calendrier")}
              >
                calendrier
              </Link>
              <Link
                href="/catalogue"
                onClick={() => handleLinkClick("catalogue")}
              >
                catalogue
              </Link>
              <Link
                href="/association"
                onClick={() => handleLinkClick("a-propos")}
                className="text-base"
              >
                plus sur l&lsquo;asso
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
