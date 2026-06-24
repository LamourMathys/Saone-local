"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HomeProductCard from "../components/HomeProductCard-component/HomeProductCard";

const scrollToBottom = () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: "smooth",
  });
};

export default function Home() {
  const [produits, setProduits] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setProduits(resJson.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="w-full bg-[#FAF6F0] min-h-screen">
      <div className="relative w-full aspect-3/1">
        <Image
          src="/banniere-SaoneLocal.svg"
          alt="Banniere Saone-Local"
          fill
          priority
          className="object-cover"
        />
        <button
          className="absolute bottom-0.75 right-20 md:right-10 lg:right-20 w-6 h-6 md:w-8 md:h-8"
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

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "32px auto",
          padding: "0 12px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "12px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {produits.slice(0, 6).map((produit: any) => (
            <HomeProductCard
              key={produit.id}
              name={produit.product_name}
              photoUrl={produit.product_photo}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
