"use client";

import Image from "next/image";
import Link from "next/link";

interface ProducerProfileProductProps {
  id: number;
  name: string;
  photoUrl?: string;
}

export default function ProducerProfileProduct({ id, name, photoUrl }: ProducerProfileProductProps) {
  const getImagePath = () => {
    if (!photoUrl) return "/productplaceholder.png";
    if (photoUrl.startsWith("http") || photoUrl.startsWith("/")) return photoUrl;
    return photoUrl.startsWith("uploads/") ? `/${photoUrl}` : `/uploads/${photoUrl}`;
  };

  return (
    <Link href={`/produit/${id}`} className="flex flex-col w-full">
      <div className="w-full h-33.75 rounded-3xl overflow-hidden relative">
        <Image
          src={getImagePath()}
          alt={name}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>

      <div className="mt-3 bg-white rounded-2xl py-2.5 px-2 text-center">
        <p className="text-[#714143] font-medium text-xs capitalize truncate">
          {name}
        </p>
      </div>
    </Link>
  );
}
