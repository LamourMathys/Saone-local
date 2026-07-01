"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import HomeProductCard from "../components/HomeProductCard-component/HomeProductCard";
import HomeProducerCard from "../components/HomeProducerCard-component/HomeProducerCard";
import Banniere from "../components/banniere-component/banniere";

const WelcomePopup = dynamic(
  () => import("../components/popup-component/popup"),
  {
    ssr: false,
  },
);

export default function Home() {
  const [produits, setProduits] = useState<any[]>([]);
  const [producteurs, setProducteurs] = useState<any[]>([]);

  useEffect(() => {
    // 1. Récupération des produits
    fetch("/api/products")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setProduits(resJson.data);

          // Préchargement en cache pendant que le popup est ouvert
          resJson.data.slice(0, 6).forEach((produit: any) => {
            const img = new window.Image();
            img.src = produit.product_photo;
          });
        }
      })
      .catch((err) => console.error(err));

    // 2. Récupération des producteurs
    fetch("/api/producers")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setProducteurs(resJson.data);

          // Préchargement en cache des photos des producteurs
          resJson.data.slice(0, 3).forEach((producer: any) => {
            const img = new window.Image();
            img.src = producer.user_photo;
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="w-full bg-[#FAF6F0] min-h-screen">
      {/* ================= ZONE BANNIÈRE ================= */}
      <Banniere />

      {/* ================= ZONE TITRE : VEDETTES ================= */}
      <div className="bg-[#9AA433] rounded-lg px-4 py-2 inline-block mt-6 mb-4 ml-3">
        <h2 className="text-white text-sm font-bold m-0">
          Les Vedettes de la semaine
        </h2>
      </div>

      {/* ================= ZONE GRILLE : PRODUITS ================= */}
      <div className="w-full max-w-full my-3 mx-auto px-3 box-border">
        <div className="grid grid-cols-3 gap-3 w-full box-border">
          {produits.slice(0, 6).map((produit: any) => (
            <HomeProductCard
              key={produit.id}
              id={produit.id}
              name={produit.product_name}
              photoUrl={produit.product_photo}
            />
          ))}
        </div>
      </div>

      {/* ================= ZONE BOUTON : EXPLOREZ LES PRODUITS ================= */}
      <Link
        href="/catalogue"
        className="bg-[#8B362E] rounded-xl px-6 py-3 flex items-center justify-center gap-2.5 my-6 mx-auto w-fit hover:opacity-90 transition-opacity"
      >
        <div className="w-6.25 h-6.25 relative">
          <Image
            src="/panier_rempli.png"
            alt="Panier"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-white text-[15px] font-semibold m-0">
          Explorez les produits
        </h2>
      </Link>

      {/* ================= ZONE TITRE : PRODUCTEURS ================= */}
      <div className="bg-[#FACA92] rounded-lg px-4 py-2 inline-block mt-2 mb-4 ml-3">
        <h2 className="text-white text-sm font-bold m-0">
          Plus sur les producteurs
        </h2>
      </div>

      {/* ================= ZONE GRILLE : PRODUCTEURS ================= */}
      <div className="w-full max-w-full my-3 mx-auto px-3 box-border">
        <div className="grid grid-cols-3 gap-3 w-full box-border">
          {producteurs.slice(0, 3).map((producers: any) => (
            <HomeProducerCard
              key={producers.id}
              id={producers.id}
              name={producers.business_name}
              firstname={producers.first_name}
              lastname={producers.last_name}
              photoUrl={producers.user_photo}
            />
          ))}
        </div>
      </div>

      {/* ================= POPUP ================= */}
      <WelcomePopup />
    </main>
  );
}
