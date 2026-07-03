"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import BoxandBouton from "../../components/boxandbouton-component/boxandbouton";
import FavoriteItem from "../../components/favorite-item/FavoriteItem";

interface FavoriteItemData {
  id: number;
  name: string;
  photoUrl: string;
  type: "product" | "producer";
  sellerName?: string;
}

export default function Favoris() {
  const [favorites, setFavorites] = useState<FavoriteItemData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/favorites/my")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          const mappedFavorites: FavoriteItemData[] = resJson.data.map((fav: any) => {
            const isProduct = !!fav.product_id;
            const sellerName = isProduct
              ? fav.product_producer_business_name ||
                `${fav.product_producer_first_name || ""} ${fav.product_producer_last_name || ""}`.trim()
              : undefined;

            return {
              id: isProduct ? fav.product_id : fav.producer_id,
              name: isProduct
                ? fav.product_name || "Produit"
                : fav.favorite_producer_business_name ||
                  `${fav.favorite_producer_first_name || ""} ${fav.favorite_producer_last_name || ""}`.trim() ||
                  "Producteur",
              photoUrl: isProduct
                ? fav.product_photo || "/productplaceholder.png"
                : fav.favorite_producer_photo || "/placeholder.png",
              type: isProduct ? "product" : "producer",
              sellerName: sellerName,
            };
          });
          setFavorites(mappedFavorites);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération des favoris:", err);
      });
  }, []);

  const handleRemoveFavorite = (id: number, type: "product" | "producer") => {
    setFavorites((prev) => prev.filter((item) => !(item.id === id && item.type === type)));

    fetch(`/api/favorites/${id}`, {
      method: "DELETE",
    }).catch((err) => console.error("Error deleting favorite:", err));
  };

  const toggleSelectKey = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedKeys.length === 0) {
      setIsEditing(false);
      return;
    }

    const remainingFavorites = favorites.filter((item) => {
      const key = `${item.type}-${item.id}`;
      return !selectedKeys.includes(key);
    });
    setFavorites(remainingFavorites);

    const deletePromises = selectedKeys.map((key) => {
      const [type, idStr] = key.split("-");
      const id = parseInt(idStr, 10);
      return fetch(`/api/favorites/${id}`, {
        method: "DELETE",
      }).catch((err) => console.error(`Error deleting favorite ${key}:`, err));
    });

    await Promise.all(deletePromises);
    setSelectedKeys([]);
    setIsEditing(false);
  };

  return (
    <main className="w-full min-h-screen bg-[#FAF6F0] pb-28">
      <div className="pt-4 px-4 flex flex-col gap-4">
        <BoxandBouton
          text="vos favoris"
          boxColor="bg-[#FACA92]"
          buttonColor="bg-[#FACA92]"
        />

        <div className="flex items-center justify-between w-full mt-2 mb-1">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-[#714143]"
              viewBox="0 0 24 24"
              fill="#FACA92"
              stroke="#e49a46"
              strokeWidth="1.5"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <h2 className="text-lg font-bold text-[#714143] tracking-wide">
              Vos favoris :
            </h2>
          </div>

          {isEditing ? (
            <button
              onClick={handleBulkDelete}
              className="w-8 h-8 bg-[#8B362E] active:scale-90 transition-transform rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
              title="Supprimer la sélection"
            >
              <Image
                src="/pictos poubelle.png"
                alt="Supprimer"
                width={16}
                height={16}
                className="object-contain brightness-0 invert"
              />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-8 h-8 bg-[#FACA92]/95 active:scale-90 transition-transform rounded-xl flex items-center justify-center shadow-sm cursor-pointer"
              title="Modifier les favoris"
            >
              <Image
                src="/pictos crayon.png"
                alt="Modifier"
                width={16}
                height={16}
                className="object-contain"
              />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-5 mt-2">
          {favorites.length > 0 ? (
            favorites.map((item) => {
              const key = `${item.type}-${item.id}`;
              return (
                <FavoriteItem
                  key={key}
                  id={item.id}
                  name={item.name}
                  photoUrl={item.photoUrl}
                  type={item.type}
                  sellerName={item.sellerName}
                  isEditing={isEditing}
                  isSelected={selectedKeys.includes(key)}
                  onSelectToggle={() => toggleSelectKey(key)}
                  onRemove={handleRemoveFavorite}
                />
              );
            })
          ) : (
            <div className="text-center py-12 text-[#9c787a] font-medium text-sm">
              Aucun produit ou producteur dans vos favoris pour le moment.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
