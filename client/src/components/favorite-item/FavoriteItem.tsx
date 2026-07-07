"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FavoriteItemProps {
  id: number;
  name: string;
  photoUrl: string;
  type?: "product" | "producer";
  sellerName?: string;
  isEditing?: boolean;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  onRemove: (id: number, type: "product" | "producer") => void;
  onAddToCart?: (id: number, quantity: number) => void;
}

export default function FavoriteItem({
  id,
  name,
  photoUrl,
  type = "product",
  sellerName,
  isEditing = false,
  isSelected = false,
  onSelectToggle,
  onRemove,
  onAddToCart,
}: FavoriteItemProps) {
  const [quantity, setQuantity] = useState(0);

  const getImagePath = () => {
    if (!photoUrl) return "/placeholder.png";
    if (photoUrl.startsWith("http") || photoUrl.startsWith("/")) return photoUrl;
    return `/uploads/avatars/${photoUrl}`;
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-transparent p-1 w-full">
      <Link 
        href={type === "product" ? `/produit/${id}` : `/producteur/${id}`}
        className="w-21 h-21 rounded-[20px] overflow-hidden relative shrink-0 block"
      >
        <Image
          src={getImagePath()}
          alt={name}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </Link>

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link 
            href={type === "product" ? `/produit/${id}` : `/producteur/${id}`}
            className="text-sm font-semibold text-[#714143] capitalize truncate block"
          >
            {name}
          </Link>
          {!isEditing && (
            <button
              onClick={() => onRemove(id, type)}
              className="text-amber-500 active:scale-95 transition-transform text-sm cursor-pointer"
              aria-label="Retirer des favoris"
            >
              ★
            </button>
          )}
        </div>

        {type === "product" ? (
          sellerName && (
            <p className="text-[10px] text-[#9c787a] mt-1 truncate">
              Vendu par {sellerName}
            </p>
          )
        ) : (
          <div className="mt-1">
            <span className="inline-block bg-[#FAF6F0] border border-[#FACA92] text-[#FACA92] px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
              Producteur
            </span>
            <p className="text-[10px] text-[#9c787a] mt-1">Artisan local</p>
          </div>
        )}
      </div>

      <div className="shrink-0 flex items-center justify-end min-w-30">
        {isEditing ? (
          <button
            onClick={() => onSelectToggle && onSelectToggle()}
            className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
              isSelected
                ? "bg-[#8B362E] border-[#8B362E]"
                : "border-[#8B362E]/30"
            }`}
          >
            {isSelected && (
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        ) : (
          type === "product" ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center justify-between bg-[#FACA92] text-white rounded-lg px-2 py-1 w-22.5 font-bold text-sm shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(0, quantity - 1))}
                  className="text-white active:scale-90 px-1 cursor-pointer"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-white active:scale-90 px-1 cursor-pointer"
                >
                  +
                </button>
              </div>
              {quantity > 0 && onAddToCart && (
                <button
                  onClick={() => {
                    onAddToCart(id, quantity);
                    setQuantity(0);
                  }}
                  className="bg-[#9AA433] text-white text-[9px] font-bold py-1 px-2.5 rounded-md active:scale-95 transition-transform cursor-pointer shadow-sm"
                >
                  Ajouter au panier
                </button>
              )}
            </div>
          ) : (
            <Link
              href={`/producteur/${id}`}
              className="bg-[#FACA92] text-white font-semibold text-[10px] py-1.5 px-4 rounded-lg text-center active:scale-95 transition-transform"
            >
              Voir la boutique
            </Link>
          )
        )}
      </div>
    </div>
  );
}
