"use client";

import Image from "next/image";
import { Baloo_2 } from "next/font/google";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["500"],
});

interface ProductCardProps {
  name: string;
  photoUrl: string;
}

export default function HomeProductCard({ name, photoUrl }: ProductCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
          src={photoUrl}
          alt={name}
          fill
          unoptimized
          priority
          style={{ objectFit: "cover" }}
        />
      </div>

      <div
        style={{
          marginTop: "12px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "10px 8px",
          textAlign: "center",
        }}
      >
        <p
          className={baloo.className}
          style={{
            color: "#714143",
            fontWeight: "500",
            fontSize: "12px",
            margin: 0,
            textTransform: "capitalize",
          }}
        >
          {name}
        </p>
      </div>
    </div>
  );
}
