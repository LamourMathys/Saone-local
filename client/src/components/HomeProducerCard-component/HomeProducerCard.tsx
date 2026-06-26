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
  return (
    <Link
      href={`/producteur/${id}`}
      style={{ display: "flex", flexDirection: "column", gap: "4px" }}
    >
      <div
        style={{
          width: "100%",
          height: "135px",
          borderRadius: "24px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Image
          src={photoUrl || "/placeholder.png"}
          alt={name || "Producteur"}
          fill
          unoptimized
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      <h2
        className={`${openSans.className} m-0 text-[8px] font-normal text-[#714143] text-center`}
      >
        {firstname} {lastname}
      </h2>

      <p
        className={`${openSans.className} m-0 font-normal text-[8px] text-[#714143] text-center`}
      >
        {name}
      </p>
    </Link>
  );
}
