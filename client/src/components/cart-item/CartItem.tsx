"use client";

import Image from "next/image";
import Link from "next/link";

interface CartItemProps {
  id: number;
  name: string;
  photoUrl: string;
  price: number;
  unit: string;
  stock: number;
  quantity: number;
  sellerName: string;
  isEditing: boolean;
  isSelected: boolean;
  onSelectToggle: () => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

export default function CartItem({
  id,
  name,
  photoUrl,
  price,
  unit,
  stock,
  quantity,
  sellerName,
  isEditing,
  isSelected,
  onSelectToggle,
  onUpdateQuantity,
}: CartItemProps) {
  const formattedPrice = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price);

  const getImagePath = () => {
    if (!photoUrl) return "/placeholder.png";
    if (photoUrl.startsWith("http") || photoUrl.startsWith("/")) return photoUrl;
    return `/uploads/products/${photoUrl}`;
  };

  return (
    <div className="flex items-center justify-between gap-3 bg-transparent p-1 w-full">
      <Link
        href={`/produit/${id}`}
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
        <h3 className="text-sm font-semibold text-[#714143] capitalize truncate">
          {name}
        </h3>
        <p className="text-xs font-bold text-[#8B362E] mt-0.5">
          {formattedPrice}/{unit}
        </p>

        <div className="flex items-center gap-1 mt-1">
          {stock > 0 ? (
            <div className="flex items-center gap-1 text-[10px] text-[#9AA433] font-bold">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="10" cy="10" r="8" stroke="currentColor" />
                <path d="M7 10l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>en stock</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[10px] text-[#8B362E] font-bold">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="10" cy="10" r="8" stroke="currentColor" />
                <path d="M7 7l6 6M13 7l-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>indisponible</span>
            </div>
          )}
        </div>

        <p className="text-[10px] text-[#9c787a] mt-1 truncate">
          Vendu par {sellerName}
        </p>
      </div>

      <div className="shrink-0 flex items-center justify-end min-w-30">
        {isEditing ? (
          <button
            onClick={onSelectToggle}
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
          <div className="flex items-center justify-between bg-white rounded-2xl px-3.5 py-1.5 w-26 text-gray-800">
            {quantity === 1 ? (
              <button
                onClick={() => onUpdateQuantity(id, 0)}
                className="text-[#6E763B] active:scale-90 cursor-pointer w-5 h-5 flex items-center justify-center"
                aria-label="Supprimer"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => onUpdateQuantity(id, quantity - 1)}
                className="text-[#6E763B] text-lg font-black active:scale-90 cursor-pointer w-5 h-5 flex items-center justify-center"
              >
                -
              </button>
            )}
            <span className="text-[#714143] text-sm font-extrabold">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(id, quantity + 1)}
              className="text-[#6E763B] text-lg font-black active:scale-90 cursor-pointer w-5 h-5 flex items-center justify-center"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
