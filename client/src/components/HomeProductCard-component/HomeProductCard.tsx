"use client";

import Image from "next/image";

interface ProductCardProps {
  name: string;
  photoUrl: string;
}

export default function HomeProductCard({ name, photoUrl }: ProductCardProps) {
  const finalSrc =
    photoUrl ||
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "135px",
          borderRadius: "24px",
          overflow: "hidden",
          backgroundColor: "#f9fafb",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          position: "relative",
        }}
      >
        <Image
          src={finalSrc}
          alt={name}
          fill
          unoptimized
          sizes="(max-width: 768px) 33vw, 25vw"
          priority
          style={{
            objectFit: "cover",
          }}
        />
      </div>

      <div
        style={{
          marginTop: "12px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "10px 8px",
          textAlign: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            color: "#714143",
            fontWeight: "500",
            fontSize: "11px",
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
