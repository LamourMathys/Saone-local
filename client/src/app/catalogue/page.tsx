"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileHeader from "../../components/boxandbouton-component/boxandbouton";
import ProductCard from "../../components/productcard/card";
import ProducerCard from "../../components/producercard/card";

export default function Catalogue() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [producers, setProducers] = useState<any[]>([]);

  const handleAddToCart = async (productId: number) => {
    try {
      const res = await fetch("/api/orders/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/connexion");
        return;
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const resJson = await res.json();
        if (resJson.success) {
        } else {
          alert(`Erreur: ${resJson.error || "Impossible d'ajouter le produit."}`);
        }
      } else {
        alert(`Erreur serveur (${res.status}). Veuillez vérifier que le serveur backend a bien été redémarré.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setProducts(resJson.data);
        }
      })
      .catch((err) => console.error(err));

    fetch("/api/producers")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          setProducers(resJson.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#FAF6F0] pb-10">
      <div className="pt-4 px-4 flex flex-col gap-4">
        <ProfileHeader
          text="catalogue"
          boxColor="bg-[#8B362E]"
          buttonColor="bg-[#8B362E]"
        />

        <div className="grid grid-cols-3 gap-3 w-full box-border">
          {producers.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))}
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
