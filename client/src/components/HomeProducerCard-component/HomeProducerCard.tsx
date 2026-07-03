"use client";

import Image from "next/image";
import { Open_Sans } from "next/font/google";
import Link from "next/link";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface ProducersCardProps {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  photoUrl: string;
}

export default function HomeProducerCard({
  id,
  name,
  firstname,
  lastname,
  photoUrl,
}: ProducersCardProps) {
  
  const getImagePath = () => {
    if (!photoUrl) return "/placeholder.png";
    
    if (photoUrl.startsWith("http")) return photoUrl;

    const cleanPath = photoUrl.replace(/^\/?(uploads\/avatars\/)?/, "");
    
    return `/uploads/avatars/${cleanPath}`;
  };

  return (
    <Link href={`/producteur/${id}`} className="flex flex-col gap-1 w-full">
      <div className="w-full h-33.75   rounded-3xl overflow-hidden relative border border-[#FACA92]/20">
        <Image
          src={getImagePath()}
          alt={name || "Producteur"}
          fill
          unoptimized
          priority
          className="object-cover"
        />
      </div>

      <h2 className={`${openSans.className} m-0 text-[8px] font-normal text-[#714143] text-center`}>
        {firstname} {lastname}
      </h2>

      <p className={`${openSans.className} m-0 font-normal text-[8px] text-[#714143] text-center`}>
        {name}
      </p>
    </Link>
  );
}