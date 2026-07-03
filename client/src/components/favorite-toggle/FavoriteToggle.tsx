"use client";

import { useEffect, useState } from "react";

interface FavoriteToggleProps {
  productId?: number;
  producerId?: number;
}

export default function FavoriteToggle({
  productId,
  producerId,
}: FavoriteToggleProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/favorites/my")
      .then((res) => res.json())
      .then((resJson) => {
        if (resJson.success && Array.isArray(resJson.data)) {
          const match = resJson.data.find((fav: any) => {
            if (productId) return fav.product_id === productId;
            if (producerId) return fav.producer_id === producerId;
            return false;
          });

          if (match) {
            setIsFavorite(true);
            setFavoriteId(match.favorite_id || match.id);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error checking favorite status:", err);
        setLoading(false);
      });
  }, [productId, producerId]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (isFavorite) {
      const targetId = favoriteId || productId || producerId;
      if (!targetId) return;

      try {
        const res = await fetch(`/api/favorites/${targetId}`, {
          method: "DELETE",
        });
        const resJson = await res.json();
        if (resJson.success) {
          setIsFavorite(false);
          setFavoriteId(null);
        }
      } catch (err) {
        console.error("Error removing favorite:", err);
      }
    } else {
      try {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productId || null,
            producer_id: producerId || null,
          }),
        });
        const resJson = await res.json();
        if (resJson.success && resJson.data) {
          setIsFavorite(true);
          setFavoriteId(resJson.data.id);
        }
      } catch (err) {
        console.error("Error adding favorite:", err);
      }
    }
  };

  if (loading) {
    return <span className="text-gray-300 text-lg">...</span>;
  }

  return (
    <button
      onClick={handleToggle}
      className={`text-xl focus:outline-none transition-transform active:scale-95 cursor-pointer ${
        isFavorite ? "text-amber-500 scale-110" : "text-gray-400"
      }`}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
}
