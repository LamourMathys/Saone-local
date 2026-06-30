"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import HomeProductCard from "../components/HomeProductCard-component/HomeProductCard";
import HomeProducerCard from "../components/HomeProducerCard-component/HomeProducerCard";
import Banniere from "../components/banniere/HomeProducerCard";

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
      <div
        style={{
          backgroundColor: "#9AA433",
          borderRadius: "8px",
          padding: "8px 16px",
          display: "inline-block",
          margin: "24px 0 16px 12px",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Les Vedettes de la semaine
        </h2>
      </div>

      {/* ================= ZONE GRILLE : PRODUITS ================= */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "12px auto",
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
              id={produit.id}
              name={produit.product_name}
              photoUrl={produit.product_photo}
            />
          ))}
        </div>
      </div>

      {/* ================= ZONE BOUTON : EXPLOREZ LES PRODUITS ================= */}
      <div
        style={{
          backgroundColor: "#8B362E",
          borderRadius: "12px",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          margin: "24px auto",
          width: "fit-content",
        }}
      >
        <div style={{ width: "25px", height: "25px", position: "relative" }}>
          <Image
            src="/panier_rempli.png"
            alt="Panier"
            fill
            className="object-contain"
          />
        </div>
        <h2
          style={{
            color: "#ffffff",
            fontSize: "15px",
            fontWeight: "600",
            margin: 0,
          }}
        >
          Explorez les produits
        </h2>
      </div>

      {/* ================= ZONE TITRE : PRODUCTEURS ================= */}
      <div
        style={{
          backgroundColor: "#FACA92",
          borderRadius: "8px",
          padding: "8px 16px",
          display: "inline-block",
          margin: "8px 0 16px 12px",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            fontSize: "14px",
            fontWeight: "700",
            margin: 0,
          }}
        >
          Plus sur les producteurs
        </h2>
      </div>

      {/* ================= ZONE GRILLE : PRODUCTEURS ================= */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "12px auto",
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
