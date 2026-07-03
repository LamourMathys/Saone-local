"use client";

import Image from "next/image";

export default function Banniere() {
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full aspect-3/1">
      <Image
        src="/banniere-SaoneLocal.svg"
        alt="Banniere Saone-Local"
        fill
        priority
        className="object-cover"
      />
      <button
        className="absolute bottom-1 right-20 md:right-10 lg:right-20 w-6 h-6 md:w-8 md:h-8"
        onClick={scrollToBottom}
      >
        <Image
          src="/picto-fleche-verte.png"
          alt="Fleche Verte"
          fill
          priority
          className="object-contain"
        />
      </button>
    </div>
  );
}
